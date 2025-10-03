@echo off
echo ========================================
echo       TechBuilder Complete Setup
echo ========================================
echo.
echo This will start both backend and frontend servers
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Press any key to start both servers...
pause >nul

echo.
echo ========================================
echo Starting Backend Server...
echo ========================================
start "TechBuilder Backend" cmd /k "cd /d C:\Users\Anindo\Desktop\TechBuilder\Backend && python manage.py runserver localhost:8000"

echo Waiting 5 seconds for backend to start...
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo Starting Frontend Server...
echo ========================================
start "TechBuilder Frontend" cmd /k "cd /d C:\Users\Anindo\Desktop\TechBuilder\Frontend\tbfront && npm run dev"

echo.
echo ========================================
echo Both servers are starting!
echo ========================================
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Check the opened CMD windows for server status.
echo Press any key to exit this window...
pause >nul