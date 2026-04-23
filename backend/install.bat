@echo off
echo Installing backend dependencies...
REM Clear npm cache
npm cache clean --force
REM Install dependencies
npm install
echo.
echo Installation complete!
echo.
echo To start the backend, run: npm run dev
pause
