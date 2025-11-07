#!/bin/bash

echo ""
echo "============================================"
echo "Personal Finance Tracker - Running"
echo "============================================"
echo ""

# Start Backend
echo "Starting backend server..."
cd backend
source env/bin/activate
uvicorn main:app --reload &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start Frontend
echo "Starting frontend server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "============================================"
echo "Application Started!"
echo "============================================"
echo ""
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo "API Documentation: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop the servers..."
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
