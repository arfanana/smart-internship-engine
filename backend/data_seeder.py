#!/usr/bin/env python3
"""
Data Seeder for Smart Internship Allocation Engine
Use this script to add existing student and internship data to the database.
"""

import json
from models import Student, Internship, Employer
from base import SessionLocal, engine
from sqlalchemy.orm import sessionmaker

# Sample data - replace with your actual data
SAMPLE_EMPLOYERS = [
    {
        "email": "hr@techcorp.com",
        "company_name": "TechCorp Solutions",
        "industry": "Technology",
        "description": "Leading technology solutions provider"
    },
    {
        "email": "careers@datatech.com",
        "company_name": "DataTech Analytics",
        "industry": "Data Science",
        "description": "Data analytics and AI solutions"
    },
    {
        "email": "jobs@innovatetech.com",
        "company_name": "InnovateTech",
        "industry": "Software Development",
        "description": "Innovative software development company"
    }
]

SAMPLE_STUDENTS = [
    {
        "email": "john.doe@university.edu",
        "full_name": "John Doe",
        "degree": "Computer Science",
        "year_of_study": 3,
        "cgpa": 8.5,
        "skills": ["Python", "JavaScript", "React", "Machine Learning"],
        "preferences": ["Technology", "Data Science", "AI"]
    },
    {
        "email": "jane.smith@university.edu",
        "full_name": "Jane Smith",
        "degree": "Information Technology",
        "year_of_study": 4,
        "cgpa": 9.2,
        "skills": ["Java", "Spring Boot", "SQL", "AWS"],
        "preferences": ["Software Development", "Cloud Computing"]
    },
    {
        "email": "mike.johnson@university.edu",
        "full_name": "Mike Johnson",
        "degree": "Data Science",
        "year_of_study": 3,
        "cgpa": 8.8,
        "skills": ["Python", "R", "SQL", "Tableau", "Machine Learning"],
        "preferences": ["Data Science", "Analytics", "AI"]
    }
]

SAMPLE_INTERNSHIPS = [
    {
        "employer_id": 1,  # Will be set after employers are created
        "title": "Machine Learning Intern",
        "description": "Work on ML models and data analysis projects",
        "required_skills": ["Python", "Machine Learning", "SQL"],
        "min_cgpa": 8.0,
        "min_year": 3,
        "positions_available": 2,
        "domain": "AI/ML"
    },
    {
        "employer_id": 2,
        "title": "Data Analyst Intern",
        "description": "Analyze large datasets and create visualizations",
        "required_skills": ["Python", "SQL", "Tableau", "Excel"],
        "min_cgpa": 7.5,
        "min_year": 2,
        "positions_available": 3,
        "domain": "Data Analytics"
    },
    {
        "employer_id": 3,
        "title": "Full Stack Developer Intern",
        "description": "Develop web applications using modern technologies",
        "required_skills": ["JavaScript", "React", "Node.js", "MongoDB"],
        "min_cgpa": 8.0,
        "min_year": 3,
        "positions_available": 4,
        "domain": "Web Development"
    }
]

def seed_employers(db):
    """Add sample employers to database"""
    print("Seeding employers...")
    for employer_data in SAMPLE_EMPLOYERS:
        employer = Employer(**employer_data)
        db.add(employer)
    db.commit()
    print(f"Added {len(SAMPLE_EMPLOYERS)} employers")

def seed_students(db):
    """Add sample students to database"""
    print("Seeding students...")
    for student_data in SAMPLE_STUDENTS:
        student = Student(**student_data)
        db.add(student)
    db.commit()
    print(f"Added {len(SAMPLE_STUDENTS)} students")

def seed_internships(db):
    """Add sample internships to database"""
    print("Seeding internships...")
    # Get employer IDs
    employers = db.query(Employer).all()
    if not employers:
        print("No employers found. Please seed employers first.")
        return

    for i, internship_data in enumerate(SAMPLE_INTERNSHIPS):
        # Assign employer_id based on available employers
        employer_id = employers[i % len(employers)].id
        internship_data["employer_id"] = employer_id

        internship = Internship(**internship_data)
        db.add(internship)

    db.commit()
    print(f"Added {len(SAMPLE_INTERNSHIPS)} internships")

def load_from_json(file_path: str, db):
    """Load data from JSON file"""
    print(f"Loading data from {file_path}...")
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)

        # Load employers
        if 'employers' in data:
            for employer_data in data['employers']:
                employer = Employer(**employer_data)
                db.add(employer)

        # Load students
        if 'students' in data:
            for student_data in data['students']:
                student = Student(**student_data)
                db.add(student)

        # Load internships
        if 'internships' in data:
            for internship_data in data['internships']:
                internship = Internship(**internship_data)
                db.add(internship)

        db.commit()
        print("Data loaded successfully from JSON file")

    except FileNotFoundError:
        print(f"File {file_path} not found")
    except json.JSONDecodeError:
        print(f"Invalid JSON format in {file_path}")
    except Exception as e:
        print(f"Error loading data: {e}")

def main():
    """Main function to seed database"""
    print("Smart Internship Allocation Engine - Data Seeder")
    print("=" * 50)

    # Create database tables
    from models import Base
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        print("\nChoose an option:")
        print("1. Seed with sample data")
        print("2. Load from JSON file")
        print("3. Clear all data")

        choice = input("\nEnter your choice (1-3): ").strip()

        if choice == "1":
            seed_employers(db)
            seed_students(db)
            seed_internships(db)
            print("\n✅ Sample data seeded successfully!")

        elif choice == "2":
            file_path = input("Enter JSON file path: ").strip()
            load_from_json(file_path, db)

        elif choice == "3":
            confirm = input("Are you sure you want to clear all data? (yes/no): ").strip().lower()
            if confirm == "yes":
                db.query(Internship).delete()
                db.query(Student).delete()
                db.query(Employer).delete()
                db.commit()
                print("✅ All data cleared!")

        else:
            print("Invalid choice")

        # Show current data count
        employer_count = db.query(Employer).count()
        student_count = db.query(Student).count()
        internship_count = db.query(Internship).count()

        print("\n📊 Current Database Status:")
        print(f"Employers: {employer_count}")
        print(f"Students: {student_count}")
        print(f"Internships: {internship_count}")

    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()