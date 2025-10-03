@echo off
echo ========================================
echo   TechBuilder Frontend Server (Next.js)
echo ========================================
echo.
echo Starting Next.js frontend server...
echo Frontend will be available at: http://localhost:3000
echo.

cd /d "C:\Users\Anindo\Desktop\TechBuilder\Frontend\tbfront"

echo Checking Node.js and npm...
node --version
npm --version

echo.
echo Installing/updating dependencies...
npm install

echo.
echo Starting development server...
npm run dev

pause