@echo off
echo Installing frontend dependencies...
REM Clear npm cache
npm cache clean --force
REM Install dependencies
npm install
echo.
echo Installation complete!
echo.
echo To start the frontend, run: npm run dev
pause
