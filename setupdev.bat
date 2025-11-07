@echo off
REM Personal Finance Tracker Setup Script
REM This script sets up both backend and frontend environments

echo.
echo ============================================
echo Personal Finance Tracker - Setup Script
echo ============================================
echo.

REM Setup Backend
echo Setting up backend environment...
cd backend

echo Creating virtual environment...
python -m venv env

echo Activating virtual environment...
call env\Scripts\activate.bat

echo Installing backend dependencies...
pip install -r requirements.txt

echo Running Alembic migrations...
alembic upgrade head

REM Seed database
echo Seeding database with sample data...
python -c "import sqlite3; conn = sqlite3.connect('finance.db'); cursor = conn.cursor(); cursor.executescript(open('seed_data.sql').read()); conn.commit(); conn.close()"

cd ..

REM Setup Frontend
echo.
echo Setting up frontend environment...
cd frontend

echo Installing frontend dependencies...
call npm install

cd ..

echo.
echo ============================================
echo Setup Complete!
echo ============================================
echo.
echo To run the application:
echo   1. Run: runapplication.bat
echo   OR
echo   2. Backend: cd backend && env\Scripts\activate && uvicorn main:app --reload
echo   3. Frontend: cd frontend && npm run dev
echo.
echo Backend API: http://localhost:8000
echo Frontend: http://localhost:5173
echo API Docs: http://localhost:8000/docs
echo.
