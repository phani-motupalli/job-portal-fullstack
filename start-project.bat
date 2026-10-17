@echo off
echo ===================================================
echo   Starting JobPortal.ai (Backend + Frontend)
echo ===================================================
echo.
echo Starting Backend on port 5000...
start "JobPortal Backend" cmd /k "cd /d D:\job-portal-fullstack\backend && node server.js"

echo Starting Frontend on port 3000...
start "JobPortal Frontend" cmd /k "cd /d D:\job-portal-fullstack\frontend && npm start"

echo.
echo Both servers are launching! 
echo Your browser will open http://localhost:3000 shortly.
echo ===================================================
timeout /t 3 >nul
exit
