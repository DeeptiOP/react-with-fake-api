@echo off
REM Quick Start Script for FakeStore Cart App with Authentication

setlocal enabledelayedexpansion

echo ================================
echo FakeStore Cart App - Setup Guide
echo ================================
echo.

echo [1] Setting up Backend
echo Installing backend dependencies...
cd server
call npm install
echo.
echo [OK] Backend dependencies installed
echo.

if exist .env (
    echo [!] .env already exists, skipping...
) else (
    copy .env.example .env
    echo [OK] .env created
    echo [!] IMPORTANT: Update server\.env with your MongoDB URI
)

cd ..
echo.

echo [2] Setting up Frontend
echo Installing frontend dependencies...
cd client
call npm install
echo.
echo [OK] Frontend dependencies installed
echo.

if exist .env (
    echo [!] .env already exists, skipping...
) else (
    copy .env.example .env
    echo [OK] .env created
)

cd ..
echo.

echo ================================
echo [OK] Setup Complete!
echo ================================
echo.

echo Next Steps:
echo.
echo 1. Start MongoDB (if using local):
echo    mongod
echo.
echo 2. Start the backend server:
echo    cd server ^&^& npm run dev
echo    (Server runs on http://localhost:5000)
echo.
echo 3. In another terminal, start the frontend:
echo    cd client ^&^& npm run dev
echo    (App runs on http://localhost:5173)
echo.
echo Demo Credentials:
echo    Email: admin@example.com
echo    Password: admin123
echo.
echo See README_AUTH.md for complete documentation
echo.
pause
