# Smart Internship Allocation Engine

A complete AI-powered system for matching students with internships using machine learning and natural language processing.

## Features

- **Backend**: FastAPI with PostgreSQL/SQLAlchemy
- **Frontend**: React with Material UI (sleek, modern design)
- **ML Matching**: TF-IDF + Cosine Similarity with weighted scoring
- **Resume Parsing**: spaCy-based text extraction from PDF/DOCX
- **Admin Dashboard**: Full CRUD operations for all entities
- **Responsive UI**: Modern, app-like interface

## Project Structure

```
internship-allocation-engine/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── models.py            # SQLAlchemy models
│   ├── base.py              # Database configuration
│   ├── matching.py          # ML matching algorithm
│   ├── resume_parser.py     # Resume parsing with spaCy
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main React app
│   │   ├── main.jsx         # Entry point
│   │   └── pages/           # Page components
│   ├── package.json         # Node dependencies
│   ├── vite.config.js       # Vite configuration
│   └── index.html           # HTML template
└── README.md
```

## Installation

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd internship-allocation-engine/backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Download spaCy model:
   ```bash
   python -m spacy download en_core_web_sm
   ```

**Note**: The application uses SQLite by default for easy setup. No database server installation required!

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd internship-allocation-engine/frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Backend

1. Start the FastAPI server:
   ```bash
   cd internship-allocation-engine/backend
   python main.py
   ```
   (or use `uvicorn main:app --reload` if you prefer)

2. The API will be available at `http://localhost:8000`

3. API documentation: `http://localhost:8000/docs`

### Frontend

1. Start the development server:
   ```bash
   cd internship-allocation-engine/frontend
   npm run dev
   ```

2. The application will be available at `http://localhost:5173`

## Usage

1. **Admin Dashboard**: View and manage all students, internships, employers, and matches
2. **Student Registration**: Manually register students or upload resumes
3. **Internship Registration**: Create new internship opportunities
4. **Resume Upload**: Upload PDF/DOCX resumes for automatic data extraction
5. **Match Finder**: Find top internship matches for students
6. **Settings**: Admin panel for data management, dark mode, and match history

## API Endpoints

### Students
- `POST /students/` - Create student
- `GET /admin/students/` - Get all students
- `PUT /admin/students/{id}` - Update student
- `DELETE /admin/students/{id}` - Delete student

### Internships
- `POST /internships/` - Create internship
- `GET /admin/internships/` - Get all internships
- `PUT /admin/internships/{id}` - Update internship
- `DELETE /admin/internships/{id}` - Delete internship

### Matching
- `GET /matches/{student_id}` - Get matches for student
- `POST /upload_resume/` - Upload and parse resume

### Admin
- `GET /admin/employers/` - Get all employers
- `GET /admin/matches/` - Get all matches

## Matching Algorithm

The system uses a weighted scoring approach:

- **Skills Matching (40%)**: TF-IDF vectorization + Cosine similarity
- **CGPA Matching (30%)**: Normalized CGPA score
- **Preferences Matching (20%)**: Keyword matching with internship domain
- **Resume Quality (10%)**: Presence of resume file

Only matches above 50% threshold are returned, limited to top 3.

## Data Management Tools

The application includes powerful tools for managing test data:

### Data Seeder (`data_seeder.py`)
Add existing student and internship data to the database:

```bash
cd internship-allocation-engine/backend
python data_seeder.py
```

**Options:**
1. **Seed with sample data** - Add predefined sample employers, students, and internships
2. **Load from JSON file** - Import data from a JSON file (see `sample_data.json` for format)
3. **Clear all data** - Remove all existing data

**Sample JSON Format:**
```json
{
  "employers": [
    {
      "email": "hr@company.com",
      "company_name": "Company Name",
      "industry": "Technology",
      "description": "Company description"
    }
  ],
  "students": [
    {
      "email": "student@university.edu",
      "full_name": "Student Name",
      "degree": "Computer Science",
      "year_of_study": 3,
      "cgpa": 8.5,
      "skills": ["Python", "JavaScript"],
      "preferences": ["Web Development", "AI"]
    }
  ],
  "internships": [
    {
      "employer_id": 1,
      "title": "Internship Title",
      "description": "Job description",
      "required_skills": ["Python", "SQL"],
      "min_cgpa": 8.0,
      "min_year": 2,
      "positions_available": 3,
      "domain": "Data Science"
    }
  ]
}
```

### Data Generator (`data_generator.py`)
Generate random test data for testing purposes:

```bash
cd internship-allocation-engine/backend
python data_generator.py
```

**Options:**
1. **Generate random students** - Create fake student profiles with realistic data
2. **Generate random employers** - Create fake company profiles
3. **Generate random internships** - Create fake internship opportunities
4. **Generate all** - Create a complete dataset with all entities
5. **Clear all data** - Remove all existing data
6. **Show database stats** - View current data counts

**Features:**
- Uses Faker library for realistic fake data
- Generates diverse skills, preferences, and domains
- Creates balanced datasets for testing
- Interactive menu system

## Settings & Administration Features

The Settings page provides comprehensive administrative controls:

### Data Management
- **Clear Specific Data**: Remove students, internships, employers, or matches individually
- **Wipe Everything**: Clear all data with confirmation dialog
- **Real-time Statistics**: View current counts of all data entities

### Appearance Settings
- **Dark Mode Toggle**: Switch between light and dark themes
- **Persistent Preferences**: Theme choice saved in localStorage
- **Smooth Transitions**: Seamless theme switching

### Match History
- **Past Matches View**: See all previous student-internship matches
- **Status Tracking**: View match status (pending, accepted, rejected)
- **Score Display**: Match percentage scores for each pairing

## Technologies Used

### Backend
- FastAPI
- SQLAlchemy
- SQLite (or PostgreSQL)
- spaCy
- scikit-learn
- PyPDF2
- python-docx
- Faker (for test data generation)

### Frontend
- React
- Material UI
- Axios
- React Router
- Vite

## Development

### Adding New Features
1. Backend: Add new endpoints in `main.py`
2. Frontend: Create new components in `src/pages/`
3. Update routing in `App.jsx`

### Database Migrations
The application uses SQLAlchemy's `create_all()` for table creation. For production, consider using Alembic for migrations.

## Quick Start with Test Data

1. **Install dependencies:**
   ```bash
   cd internship-allocation-engine/backend
   pip install -r requirements.txt
   python -m spacy download en_core_web_sm
   ```

2. **Generate test data:**
   ```bash
   python data_generator.py
   # Choose option 4 to generate complete dataset
   ```

3. **Start the application:**
   ```bash
   python main.py
   ```

4. **Open frontend:**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

## License

This project is open source and available under the MIT License.