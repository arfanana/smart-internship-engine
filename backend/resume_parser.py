import spacy
import re
from typing import Dict, List

# Load spaCy model (ensure 'en_core_web_sm' is installed)
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Warning: spaCy model 'en_core_web_sm' not found. Please run: python -m spacy download en_core_web_sm")
    nlp = None

def extract_text_from_pdf(file_path: str) -> str:
    """
    Extract text from PDF file.
    """
    # Placeholder - in real implementation, use PyPDF2 or pdfplumber
    # For now, assume text is provided or use a library
    # Install PyPDF2 and use it
    from PyPDF2 import PdfReader
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text

def extract_text_from_docx(file_path: str) -> str:
    """
    Extract text from DOCX file.
    """
    from docx import Document
    doc = Document(file_path)
    text = ""
    for para in doc.paragraphs:
        text += para.text + "\n"
    return text

def parse_resume(text: str) -> Dict:
    """
    Parse resume text to extract name, degree, CGPA, skills.
    """
    if nlp is None:
        return {
            "full_name": "",
            "degree": "",
            "cgpa": None,
            "skills": []
        }

    doc = nlp(text)

    # Extract name (first proper noun entity)
    name = ""
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            name = ent.text
            break

    # Extract degree (look for common degree keywords)
    degree_keywords = ["bachelor", "master", "phd", "b.tech", "m.tech", "bsc", "msc", "ba", "ma"]
    degree = ""
    for token in doc:
        if token.text.lower() in degree_keywords:
            degree = token.text
            break

    # Extract CGPA (regex for numbers like 8.5 or 3.5/4.0)
    cgpa_match = re.search(r'(\d+\.\d+)(?:/(\d+\.\d+))?', text)
    cgpa = float(cgpa_match.group(1)) if cgpa_match else None

    # Extract skills (nouns and proper nouns that might be skills)
    skills = []
    for token in doc:
        if token.pos_ in ["NOUN", "PROPN"] and len(token.text) > 2:
            skills.append(token.text.lower())

    # Remove duplicates and common words
    skills = list(set(skills))
    skills = [skill for skill in skills if skill not in ["name", "email", "phone", "address"]]

    return {
        "full_name": name,
        "degree": degree,
        "cgpa": cgpa,
        "skills": skills[:10]  # Limit to top 10
    }

def process_resume_file(file_path: str) -> Dict:
    """
    Process uploaded resume file and extract data.
    """
    if file_path.endswith(".pdf"):
        text = extract_text_from_pdf(file_path)
    elif file_path.endswith(".docx"):
        text = extract_text_from_docx(file_path)
    else:
        raise ValueError("Unsupported file type")

    return parse_resume(text)