@echo off
echo ========================================
echo Beach Cleanup App - Easy Installer
echo ========================================
echo.

REM Check if Python is installed
echo [1/7] Checking for Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed!
    echo Please install Python 3.8 or higher from https://www.python.org/downloads/
    echo.
    pause
    exit /b 1
)
python --version
echo.

REM Check if Node.js is installed
echo [2/7] Checking for Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js 18 or higher from https://nodejs.org/
    echo.
    pause
    exit /b 1
)
node --version
npm --version
echo.

REM Create virtual environment if it doesn't exist
echo [3/7] Setting up Python virtual environment...
if not exist "venv\" (
    echo Creating new virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment!
        pause
        exit /b 1
    )
    echo Virtual environment created!
) else (
    echo Virtual environment already exists!
)
echo.

REM Activate virtual environment and install Python dependencies
echo [4/7] Installing Python dependencies...
call venv\Scripts\activate
if errorlevel 1 (
    echo ERROR: Failed to activate virtual environment!
    pause
    exit /b 1
)
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install Python dependencies!
    pause
    exit /b 1
)
echo Python dependencies installed!
echo.

REM Install Node.js dependencies
echo [5/7] Installing Node.js dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install Node.js dependencies!
    pause
    exit /b 1
)
echo Node.js dependencies installed!
echo.

REM Initialize database
echo [6/7] Initializing database...
if exist "server_py\init_database.py" (
    cd server_py
    python init_database.py
    if errorlevel 1 (
        echo WARNING: Database initialization had issues, but continuing...
    ) else (
        echo Database initialized!
    )
    cd ..
) else (
    echo Database initialization script not found, skipping...
)
echo.

REM Final success message
echo [7/7] Verifying installation...
pip list | findstr "fastapi uvicorn"
echo.

echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo All dependencies have been installed successfully!
echo.
echo TO RUN THE APP:
echo.
echo   Option 1 (Easiest):
echo   -------------------
echo   Terminal 1: Double-click start-python-backend.bat
echo   Terminal 2: npm run dev
echo.
echo   Option 2 (Manual):
echo   ------------------
echo   Terminal 1: venv\Scripts\activate
echo               cd server_py
echo               python run.py
echo.
echo   Terminal 2: npm run dev
echo.
echo Then open: http://localhost:5173
echo API Docs:  http://localhost:8000/docs
echo.
echo ========================================
pause
