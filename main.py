import os
import fitz  
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from openai import OpenAI
from typing import List

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI()
DATABASE = []

# --- 1. The Pydantic Models ---
class PolicyExtraction(BaseModel):
    payerName: str = Field(description="The health plan or insurance company name.")
    drugName: str = Field(description="The primary medical benefit drug name.")
    isCovered: str = Field(description="Is it covered? (e.g., 'Covered', 'Not Covered', 'Restricted')")
    requiredDiagnosis: str = Field(description="The specific diagnosis required for approval.")
    stepTherapy: str = Field(description="What other drugs must the patient try and fail first? If none, say 'None'.")
    priorAuth: str = Field(description="Is Prior Authorization required? (Yes/No)")
    siteOfCare: str = Field(description="Where must it be administered? (e.g., Clinic, Hospital, Home Infusion)")

class CompareRequest(BaseModel):
    id1: str
    id2: str

class ComparisonResult(BaseModel):
    keyDifferences: List[str] = Field(description="Short bullet points highlighting the exact clinical or coverage changes between the two documents.")
    impactLevel: str = Field(description="Classify the change as 'Low', 'Medium', or 'High' impact.")

# --- 2. Helper Functions ---
def extract_text_from_pdf(file_path: str) -> str:
    text = ""
    try:
        with fitz.open(file_path) as doc:
            for page in doc:
                text += page.get_text()
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
    return text

def parse_with_ai(raw_text: str) -> PolicyExtraction:
    completion = client.beta.chat.completions.parse(
        model="gpt-4o-mini", 
        messages=[
            {"role": "system", "content": "You are an expert market access analyst. Extract the core formulary and coverage data from this medical benefit drug policy."},
            {"role": "user", "content": f"Document Text:\n{raw_text}"}
        ],
        response_format=PolicyExtraction, 
    )
    return completion.choices[0].message.parsed

# --- 3. Bulk Ingestion on Startup ---
@app.on_event("startup")
async def load_local_pdfs():
    print("Starting automated policy ingestion...")
    library_dir = "policy_library"
    os.makedirs(library_dir, exist_ok=True)
    
    pdf_files = [f for f in os.listdir(library_dir) if f.endswith('.pdf')]
    
    for filename in pdf_files:
        file_path = os.path.join(library_dir, filename)
        print(f"Processing: {filename}")
        
        raw_text = extract_text_from_pdf(file_path)
        
        try:
            ai_result = parse_with_ai(raw_text)
            
            # FIXED: We are now mapping the exact new variables from the Pydantic model
            policy_data = {
                "id": str(len(DATABASE) + 1), 
                "documentName": filename,
                "payerName": ai_result.payerName,
                "drugName": ai_result.drugName,
                "isCovered": ai_result.isCovered,
                "requiredDiagnosis": ai_result.requiredDiagnosis,
                "stepTherapy": ai_result.stepTherapy,
                "priorAuth": ai_result.priorAuth,
                "siteOfCare": ai_result.siteOfCare,
                "raw_text": raw_text 
            }
            DATABASE.append(policy_data)
            print(f"Successfully loaded: {ai_result.drugName} ({ai_result.payerName})")
        except Exception as e:
            print(f"AI Parsing failed for {filename}: {e}")

# --- 4. API Endpoints ---
@app.get("/api/policies")
async def get_policies():
    # Return everything to the frontend EXCEPT the giant raw_text block
    return [{k: v for k, v in p.items() if k != "raw_text"} for p in DATABASE]

@app.post("/api/compare")
async def compare_policies(req: CompareRequest):
    doc1 = next((p for p in DATABASE if p["id"] == req.id1), None)
    doc2 = next((p for p in DATABASE if p["id"] == req.id2), None)
    if not doc1 or not doc2:
        return {"error": "Could not find both documents."}

    completion = client.beta.chat.completions.parse(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a strict compliance auditor. Compare these two medical policies and identify exactly what changed or differs."},
            {"role": "user", "content": f"Policy 1 ({doc1['payerName']} - {doc1['drugName']}):\n{doc1['raw_text']}\n\nPolicy 2 ({doc2['payerName']} - {doc2['drugName']}):\n{doc2['raw_text']}"}
        ],
        response_format=ComparisonResult,
    )
    return completion.choices[0].message.parsed