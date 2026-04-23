@echo off
color 0A
echo.
echo Starting LMS Backend Server...
echo.
echo Backend will run on: http://localhost:5000
echo API: http://localhost:5000/api
echo.
echo Make sure MongoDB is running before starting!
echo.
echo Press Ctrl+C to stop the server
echo.
npm run dev
pause
