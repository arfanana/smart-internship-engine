from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Database URL - configurable
# DATABASE_URL = "postgresql://user:password@localhost/internship_db"  # Update with your PostgreSQL credentials
# For development with SQLite: DATABASE_URL = "sqlite:///./internship.db"
DATABASE_URL = "sqlite:///./internship.db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()