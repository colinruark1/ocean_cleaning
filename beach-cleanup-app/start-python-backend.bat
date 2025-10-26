@echo off
echo ============================================================
echo   Beach Cleanup App - Python Backend Starter
echo ============================================================
echo.

REM Check if venv exists
if not exist "venv\Scripts\activate.bat" (
    echo ERROR: Virtual environment not found!
    echo Please create it first: python -m venv venv
    echo.
    pause
    exit /b 1
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo Checking Python dependencies...
python -c "import fastapi" 2>nul
if errorlevel 1 (
    echo.
    echo Installing dependencies...
    pip install -r requirements.txt
)

echo.
echo Changing to server directory...
cd server_py

echo.
echo Checking if database exists...
if not exist "database.db" (
    echo Database not found. Initializing...
    python init_database.py
)

echo.
echo ============================================================
echo   Starting Python Backend Server...
echo   API Docs: http://localhost:8000/docs
echo   Press CTRL+C to stop
echo ============================================================
echo.

python run.py

pause
