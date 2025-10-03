@echo off
echo ========================================
echo    TechBuilder Backend Server (Django)
echo ========================================
echo.
echo Starting Django backend server...
echo Backend will be available at: http://localhost:8000
echo API endpoints at: http://localhost:8000/api/
echo.

set ROOT_DIR=C:\Users\Anindo\Desktop\TechBuilder
set VENV_PY=%ROOT_DIR%\.venv\Scripts\python.exe

cd /d "%ROOT_DIR%\Backend"

if exist "%VENV_PY%" (
	set PYEXE=%VENV_PY%
) else (
	echo [WARN] Project virtualenv not found, falling back to system Python.
	set PYEXE=python
)

echo Using Python: %PYEXE%
"%PYEXE%" -c "import sys, django; print('Python:', sys.executable); print('Django version:', django.get_version())"

REM Show database in use (engine and name)
"%PYEXE%" -c "import os; os.environ.setdefault('DJANGO_SETTINGS_MODULE','techbuilder.settings'); import django; django.setup(); from django.conf import settings; db=settings.DATABASES['default']; print('Database engine:', db.get('ENGINE')); print('Database name:  ', db.get('NAME'))"

echo.
echo Starting server...
"%PYEXE%" manage.py runserver localhost:8000

pause
