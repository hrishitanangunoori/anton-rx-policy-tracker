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

# --- 1. Aggressively Prompted Pydantic Models for Multiple Drugs ---

# This defines the shape of ONE drug's policy
class SingleDrugPolicy(BaseModel):
    payerName: str = Field(description="The short, recognizable name of the health plan ONLY (e.g., 'Cigna', 'UHC', 'BCBS NC', 'Florida Blue', 'Priority Health'). Do NOT include 'Corporate Medical Policy' or long company suffixes.")
    drugName: str = Field(description="The EXACT brand or generic drug name ONLY (e.g., 'Avastin', 'Rituximab', 'Botox', 'Bevacizumab'). NEVER output program titles, document names, or the word 'policy'. Keep it to 1 or 2 words maximum.")
    isCovered: str = Field(description="Is the drug covered? Output strictly one of: 'Covered', 'Not Covered', or 'Restricted'.")
    requiredDiagnosis: str = Field(description="The core diagnosis required for approval. Keep it extremely brief (e.g., 'Rheumatoid Arthritis', 'Colorectal Cancer').")
    stepTherapy: str = Field(description="What specific drugs must the patient try and fail first? If none are mentioned, strictly output 'None'.")
    priorAuth: str = Field(description="Is Prior Authorization required? Output strictly 'Yes' or 'No'.")
    siteOfCare: str = Field(description="Where must it be administered? (e.g., 'Clinic', 'Hospital', 'Home Infusion', or 'Unrestricted').")

# NEW: This wrapper forces the AI to return an ARRAY of drugs
class DocumentExtraction(BaseModel):
    policies: List[SingleDrugPolicy] = Field(description="A comprehensive list of every individual medical benefit drug and its specific coverage criteria found in the document.")


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

def parse_with_ai(raw_text: str) -> DocumentExtraction:
    completion = client.beta.chat.completions.parse(
        model="gpt-4o-mini", 
        messages=[
            {"role": "system", "content": "You are an expert market access analyst. Read this document and extract the coverage criteria for EVERY SINGLE DRUG mentioned. Return a complete array."},
            {"role": "user", "content": f"Document Text:\n{raw_text}"}
        ],
        response_format=DocumentExtraction, # Forces the array output
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
            
            # Loop through the array of drugs returned by the AI
            for policy in ai_result.policies:
                policy_data = {
                    "id": str(len(DATABASE) + 1), 
                    "documentName": filename,
                    "payerName": policy.payerName,
                    "drugName": policy.drugName,
                    "isCovered": policy.isCovered,
                    "requiredDiagnosis": policy.requiredDiagnosis,
                    "stepTherapy": policy.stepTherapy,
                    "priorAuth": policy.priorAuth,
                    "siteOfCare": policy.siteOfCare,
                    "raw_text": raw_text 
                }
                DATABASE.append(policy_data)
                print(f"  -> Extracted: {policy.drugName} ({policy.payerName})")
                
        except Exception as e:
            print(f"AI Parsing failed for {filename}: {e}")
    
    print(f"Ingestion complete. {len(DATABASE)} drug policies loaded into memory.")

# --- 4. API Endpoints ---
@app.get("/api/policies")
async def get_policies():
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