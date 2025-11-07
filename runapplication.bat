@echo off
REM Personal Finance Tracker Run Script
REM This script starts both backend and frontend servers

echo.
echo ============================================
echo Personal Finance Tracker - Running
echo ============================================
echo.

REM Start Backend in a new window
echo Starting backend server...
start "Finance Tracker Backend" cmd /k "cd backend && env\Scripts\activate && uvicorn main:app --reload"

REM Wait for backend to start
timeout /t 3 /nobreak

REM Start Frontend in a new window
echo Starting frontend server...
start "Finance Tracker Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ============================================
echo Application Started!
echo ============================================
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo API Documentation: http://localhost:8000/docs
echo.
echo Press any key to close this window...
pause
