#!/bin/bash

echo ""
echo "============================================"
echo "Personal Finance Tracker - Setup Script"
echo "============================================"
echo ""

# Setup Backend
echo "Setting up backend environment..."
cd backend

echo "Creating virtual environment..."
python3 -m venv env

echo "Activating virtual environment..."
source env/bin/activate

echo "Installing backend dependencies..."
pip install -r requirements.txt

echo "Running Alembic migrations..."
alembic upgrade head

# Seed database
echo "Seeding database with sample data..."
python3 << 'EOF'
import sqlite3
conn = sqlite3.connect('finance.db')
cursor = conn.cursor()
with open('seed_data.sql', 'r') as f:
    cursor.executescript(f.read())
conn.commit()
conn.close()
EOF

cd ..

# Setup Frontend
echo ""
echo "Setting up frontend environment..."
cd frontend

echo "Installing frontend dependencies..."
npm install

cd ..

echo ""
echo "============================================"
echo "Setup Complete!"
echo "============================================"
echo ""
echo "To run the application:"
echo "  1. Run: ./runapplication.sh"
echo "  OR"
echo "  2. Backend: cd backend && source env/bin/activate && uvicorn main:app --reload"
echo "  3. Frontend: cd frontend && npm run dev"
echo ""
echo "Backend API: http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo "API Docs: http://localhost:8000/docs"
echo ""
