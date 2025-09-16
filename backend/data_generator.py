#!/usr/bin/env python3
"""
Random Data Generator for Smart Internship Allocation Engine
Generates random test data for students and internships.
"""

import random
import faker
from models import Student, Internship, Employer
from base import SessionLocal, engine

# Initialize Faker for generating realistic fake data
fake = faker.Faker()

# Data pools for generating random data
SKILLS_POOL = [
    "Python", "JavaScript", "Java", "C++", "C#", "React", "Angular", "Vue.js",
    "Node.js", "Express", "Django", "Flask", "Spring Boot", "SQL", "MongoDB",
    "PostgreSQL", "MySQL", "Redis", "AWS", "Azure", "Docker", "Kubernetes",
    "Machine Learning", "Deep Learning", "Data Science", "Pandas", "NumPy",
    "TensorFlow", "PyTorch", "Tableau", "Power BI", "Excel", "Git", "Linux",
    "HTML", "CSS", "TypeScript", "Go", "Rust", "PHP", "Ruby", "Swift", "Kotlin"
]

PREFERENCES_POOL = [
    "Technology", "Data Science", "AI/ML", "Web Development", "Mobile Development",
    "Cloud Computing", "DevOps", "Cybersecurity", "Blockchain", "IoT",
    "Software Development", "Analytics", "Research", "Product Management"
]

DOMAINS_POOL = [
    "AI/ML", "Data Science", "Web Development", "Mobile Apps", "Cloud Computing",
    "DevOps", "Cybersecurity", "Blockchain", "IoT", "Software Engineering",
    "Data Analytics", "Product Development", "Research", "Quality Assurance"
]

INDUSTRIES_POOL = [
    "Technology", "Software Development", "Data Science", "Consulting",
    "E-commerce", "FinTech", "HealthTech", "EdTech", "Gaming", "Media"
]

DEGREES_POOL = [
    "Computer Science", "Information Technology", "Data Science", "Software Engineering",
    "Computer Engineering", "Information Systems", "Mathematics", "Statistics",
    "Physics", "Electrical Engineering", "Mechanical Engineering", "Business"
]

def generate_random_student():
    """Generate a random student"""
    first_name = fake.first_name()
    last_name = fake.last_name()
    email = f"{first_name.lower()}.{last_name.lower()}@{fake.domain_name()}"

    # Random skills (3-8 skills)
    num_skills = random.randint(3, 8)
    skills = random.sample(SKILLS_POOL, num_skills)

    # Random preferences (1-3 preferences)
    num_prefs = random.randint(1, 3)
    preferences = random.sample(PREFERENCES_POOL, num_prefs)

    return {
        "email": email,
        "full_name": f"{first_name} {last_name}",
        "degree": random.choice(DEGREES_POOL),
        "year_of_study": random.randint(1, 4),
        "cgpa": round(random.uniform(6.0, 10.0), 1),
        "skills": skills,
        "preferences": preferences
    }

def generate_random_employer():
    """Generate a random employer"""
    company_name = fake.company()
    domain = fake.domain_name()

    return {
        "email": f"careers@{domain}",
        "company_name": company_name,
        "industry": random.choice(INDUSTRIES_POOL),
        "description": fake.catch_phrase()
    }

def generate_random_internship(employer_id):
    """Generate a random internship"""
    titles = [
        "Software Development Intern",
        "Data Science Intern",
        "Machine Learning Intern",
        "Web Development Intern",
        "Mobile App Development Intern",
        "DevOps Intern",
        "Data Analyst Intern",
        "Full Stack Developer Intern",
        "Frontend Developer Intern",
        "Backend Developer Intern",
        "AI/ML Engineer Intern",
        "Cloud Computing Intern"
    ]

    descriptions = [
        "Work on exciting projects and gain valuable experience",
        "Join our team and contribute to innovative solutions",
        "Develop skills in cutting-edge technologies",
        "Collaborate with experienced professionals",
        "Build real-world applications and systems",
        "Learn industry best practices and methodologies"
    ]

    # Random required skills (2-6 skills)
    num_skills = random.randint(2, 6)
    required_skills = random.sample(SKILLS_POOL, num_skills)

    return {
        "employer_id": employer_id,
        "title": random.choice(titles),
        "description": random.choice(descriptions),
        "required_skills": required_skills,
        "min_cgpa": round(random.uniform(6.5, 8.5), 1),
        "min_year": random.randint(1, 3),
        "positions_available": random.randint(1, 5),
        "domain": random.choice(DOMAINS_POOL)
    }

def generate_students(db, count=50):
    """Generate and add random students to database"""
    print(f"Generating {count} random students...")
    students = []

    for _ in range(count):
        student_data = generate_random_student()
        student = Student(**student_data)
        students.append(student)

    db.add_all(students)
    db.commit()
    print(f"✅ Added {count} students to database")

def generate_employers(db, count=10):
    """Generate and add random employers to database"""
    print(f"Generating {count} random employers...")
    employers = []

    for _ in range(count):
        employer_data = generate_random_employer()
        employer = Employer(**employer_data)
        employers.append(employer)

    db.add_all(employers)
    db.commit()
    print(f"✅ Added {count} employers to database")

def generate_internships(db, count=30):
    """Generate and add random internships to database"""
    print(f"Generating {count} random internships...")

    # Get all employer IDs
    employers = db.query(Employer).all()
    if not employers:
        print("❌ No employers found. Please generate employers first.")
        return

    internships = []
    for _ in range(count):
        employer = random.choice(employers)
        internship_data = generate_random_internship(employer.id)
        internship = Internship(**internship_data)
        internships.append(internship)

    db.add_all(internships)
    db.commit()
    print(f"✅ Added {count} internships to database")

def clear_all_data(db):
    """Clear all data from database"""
    print("Clearing all data...")
    db.query(Internship).delete()
    db.query(Student).delete()
    db.query(Employer).delete()
    db.commit()
    print("✅ All data cleared")

def show_stats(db):
    """Show current database statistics"""
    employer_count = db.query(Employer).count()
    student_count = db.query(Student).count()
    internship_count = db.query(Internship).count()

    print("\n📊 Current Database Status:")
    print(f"Employers: {employer_count}")
    print(f"Students: {student_count}")
    print(f"Internships: {internship_count}")

def main():
    """Main function for data generation"""
    print("🎲 Smart Internship Allocation Engine - Data Generator")
    print("=" * 60)

    # Create database tables
    from models import Base
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        while True:
            print("\nChoose an option:")
            print("1. Generate random students")
            print("2. Generate random employers")
            print("3. Generate random internships")
            print("4. Generate all (employers + students + internships)")
            print("5. Clear all data")
            print("6. Show database stats")
            print("7. Exit")

            choice = input("\nEnter your choice (1-7): ").strip()

            if choice == "1":
                count = int(input("How many students to generate? (default: 50): ") or "50")
                generate_students(db, count)

            elif choice == "2":
                count = int(input("How many employers to generate? (default: 10): ") or "10")
                generate_employers(db, count)

            elif choice == "3":
                count = int(input("How many internships to generate? (default: 30): ") or "30")
                generate_internships(db, count)

            elif choice == "4":
                print("Generating complete dataset...")
                employer_count = int(input("How many employers? (default: 10): ") or "10")
                student_count = int(input("How many students? (default: 50): ") or "50")
                internship_count = int(input("How many internships? (default: 30): ") or "30")

                generate_employers(db, employer_count)
                generate_students(db, student_count)
                generate_internships(db, internship_count)
                print("✅ Complete dataset generated!")

            elif choice == "5":
                confirm = input("Are you sure you want to clear all data? (yes/no): ").strip().lower()
                if confirm == "yes":
                    clear_all_data(db)

            elif choice == "6":
                show_stats(db)

            elif choice == "7":
                print("Goodbye! 👋")
                break

            else:
                print("Invalid choice. Please try again.")

            show_stats(db)

    except KeyboardInterrupt:
        print("\n\nGoodbye! 👋")
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()