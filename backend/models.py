from sqlalchemy import Column, Integer, String, Float, Boolean, JSON, ForeignKey
from sqlalchemy.orm import relationship
from base import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    degree = Column(String)
    year_of_study = Column(Integer)
    cgpa = Column(Float)
    skills = Column(JSON)  # List of skills
    preferences = Column(JSON)  # List of preferences
    resume_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)

class Internship(Base):
    __tablename__ = "internships"

    id = Column(Integer, primary_key=True, index=True)
    employer_id = Column(Integer, ForeignKey("employers.id"))
    title = Column(String)
    description = Column(String)
    required_skills = Column(JSON)  # List of required skills
    min_cgpa = Column(Float)
    min_year = Column(Integer)
    positions_available = Column(Integer)
    domain = Column(String)
    is_active = Column(Boolean, default=True)

    employer = relationship("Employer")

class Employer(Base):
    __tablename__ = "employers"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    company_name = Column(String)
    industry = Column(String)
    description = Column(String)
    is_active = Column(Boolean, default=True)

class Match(Base):
    __tablename__ = "matches"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    internship_id = Column(Integer, ForeignKey("internships.id"))
    match_score = Column(Float)
    status = Column(String, default="pending")  # pending, accepted, rejected

    student = relationship("Student")
    internship = relationship("Internship")
