@echo off
color 0A
echo.
echo Starting LMS Frontend Server...
echo.
echo Frontend will run on: http://localhost:3000
echo.
echo Make sure the backend server is running on port 5000!
echo.
echo Press Ctrl+C to stop the server
echo.
cd /d "%~dp0"
npm run dev
pause
