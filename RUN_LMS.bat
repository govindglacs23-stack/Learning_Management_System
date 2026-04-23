@echo off
color 0A
cls
:start
echo.
echo ================================
echo   LMS - Learning Management System
echo ================================
echo.
echo Choose what to do:
echo.
echo 1. Install Backend Dependencies
echo 2. Install Frontend Dependencies
echo 3. Install Both
echo 4. Run Backend (npm run dev)
echo 5. Run Frontend (npm run dev)
echo 6. Exit
echo.
set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" (
    cls
    cd backend
    echo Installing Backend...
    npm cache clean --force
    npm install
    pause
) else if "%choice%"=="2" (
    cls
    cd frontend
    echo Installing Frontend...
    npm cache clean --force
    npm install
    pause
) else if "%choice%"=="3" (
    cls
    echo Installing Backend...
    cd backend
    npm cache clean --force
    npm install
    cd ..
    echo.
    echo Installing Frontend...
    cd frontend
    npm cache clean --force
    npm install
    cd ..
    echo.
    echo Both installations complete!
    pause
) else if "%choice%"=="4" (
    cls
    cd backend
    echo Starting Backend on http://localhost:5000
    echo.
    echo Press Ctrl+C to stop the server
    echo.
    npm run dev
) else if "%choice%"=="5" (
    cls
    cd frontend
    echo Starting Frontend on http://localhost:3000
    echo.
    echo Press Ctrl+C to stop the server
    echo.
    npm run dev
) else if "%choice%"=="6" (
    exit
) else (
    echo Invalid choice. Please try again.
    pause
    cls
    goto start
)
