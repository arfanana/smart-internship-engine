from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import os
import shutil

from models import Student, Internship, Employer, Match
from base import get_db, engine, Base
from matching import find_matches_for_student, save_match
from resume_parser import process_resume_file

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Smart Internship Allocation Engine", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class StudentCreate(BaseModel):
    email: str
    full_name: str
    degree: str
    year_of_study: int
    cgpa: float
    skills: List[str]
    preferences: List[str]

class InternshipCreate(BaseModel):
    employer_id: int
    title: str
    description: str
    required_skills: List[str]
    min_cgpa: float
    min_year: int
    positions_available: int
    domain: str

class EmployerCreate(BaseModel):
    email: str
    company_name: str
    industry: str
    description: str

class MatchResponse(BaseModel):
    internship_id: int
    title: str
    description: str
    required_skills: List[str]
    domain: str
    match_score: float

# Endpoints

@app.post("/students/", response_model=StudentCreate)
def create_student(student: StudentCreate, db: Session = Depends(get_db)):
    db_student = Student(**student.dict())
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

@app.post("/internships/", response_model=InternshipCreate)
def create_internship(internship: InternshipCreate, db: Session = Depends(get_db)):
    db_internship = Internship(**internship.dict())
    db.add(db_internship)
    db.commit()
    db.refresh(db_internship)
    return db_internship

@app.get("/matches/{student_id}", response_model=List[MatchResponse])
def get_matches(student_id: int, db: Session = Depends(get_db)):
    matches = find_matches_for_student(student_id)
    # Save matches to DB
    for match in matches:
        save_match(student_id, match["internship_id"], match["match_score"])
    return matches

@app.post("/upload_resume/")
def upload_resume(file: UploadFile = File(...)):
    if not file.filename.endswith(('.pdf', '.docx')):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")

    # Save file temporarily
    file_path = f"temp_{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # Parse resume
        parsed_data = process_resume_file(file_path)
        return {"extracted_data": parsed_data, "message": "Resume parsed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error parsing resume: {str(e)}")
    finally:
        # Clean up temp file
        if os.path.exists(file_path):
            os.remove(file_path)

# Admin CRUD endpoints

@app.get("/admin/students/")
def get_students(db: Session = Depends(get_db)):
    return db.query(Student).all()

@app.get("/admin/internships/")
def get_internships(db: Session = Depends(get_db)):
    return db.query(Internship).all()

@app.get("/admin/employers/")
def get_employers(db: Session = Depends(get_db)):
    return db.query(Employer).all()

@app.get("/admin/matches/")
def get_matches_admin(db: Session = Depends(get_db)):
    return db.query(Match).all()

@app.put("/admin/students/{student_id}")
def update_student(student_id: int, student: StudentCreate, db: Session = Depends(get_db)):
    db_student = db.query(Student).filter(Student.id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    for key, value in student.dict().items():
        setattr(db_student, key, value)
    db.commit()
    return db_student

@app.put("/admin/internships/{internship_id}")
def update_internship(internship_id: int, internship: InternshipCreate, db: Session = Depends(get_db)):
    db_internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not db_internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    for key, value in internship.dict().items():
        setattr(db_internship, key, value)
    db.commit()
    return db_internship

@app.delete("/admin/students/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db)):
    db_student = db.query(Student).filter(Student.id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    db.delete(db_student)
    db.commit()
    return {"message": "Student deleted"}

@app.delete("/admin/internships/{internship_id}")
def delete_internship(internship_id: int, db: Session = Depends(get_db)):
    db_internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not db_internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    db.delete(db_internship)
    db.commit()
    return {"message": "Internship deleted"}

# Employer endpoints
@app.post("/employers/", response_model=EmployerCreate)
def create_employer(employer: EmployerCreate, db: Session = Depends(get_db)):
    db_employer = Employer(**employer.dict())
    db.add(db_employer)
    db.commit()
    db.refresh(db_employer)
    return db_employer

# Data management endpoints for settings
@app.delete("/admin/clear/{data_type}")
def clear_data(data_type: str, db: Session = Depends(get_db)):
    """Clear specific type of data or all data"""
    try:
        if data_type == "students":
            db.query(Student).delete()
        elif data_type == "internships":
            db.query(Internship).delete()
        elif data_type == "employers":
            db.query(Employer).delete()
        elif data_type == "matches":
            db.query(Match).delete()
        elif data_type == "all":
            db.query(Match).delete()
            db.query(Student).delete()
            db.query(Internship).delete()
            db.query(Employer).delete()
        else:
            raise HTTPException(status_code=400, detail="Invalid data type")

        db.commit()
        return {"message": f"{data_type} data cleared successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error clearing data: {str(e)}")

@app.get("/admin/stats")
def get_database_stats(db: Session = Depends(get_db)):
    """Get database statistics"""
    return {
        "employers": db.query(Employer).count(),
        "students": db.query(Student).count(),
        "internships": db.query(Internship).count(),
        "matches": db.query(Match).count()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)