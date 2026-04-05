import fitz
import os

folder_path = r"C:\Users\eesha\OneDrive\Desktop\innovation hacks 2.0\anton-rx-policy-tracker\sample data"

for filename in os.listdir(folder_path):
    if filename.endswith(".pdf"):
        file_path = os.path.join(folder_path, filename)
        
        # Open and process each file
        with fitz.open(file_path) as doc:
            print(f"Processing {filename} with {doc.page_count} pages.")