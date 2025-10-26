#!/bin/bash

echo "========================================"
echo "Beach Cleanup App - Easy Installer"
echo "========================================"
echo ""

# Check if Python is installed
echo "[1/7] Checking for Python..."
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed!"
    echo "Please install Python 3.8 or higher:"
    echo "  - Mac: brew install python3"
    echo "  - Ubuntu/Debian: sudo apt install python3 python3-pip python3-venv"
    echo "  - Fedora: sudo dnf install python3 python3-pip"
    exit 1
fi
python3 --version
echo ""

# Check if Node.js is installed
echo "[2/7] Checking for Node.js..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js 18 or higher:"
    echo "  - Mac: brew install node"
    echo "  - Ubuntu/Debian: sudo apt install nodejs npm"
    echo "  - Fedora: sudo dnf install nodejs npm"
    echo "Or visit: https://nodejs.org/"
    exit 1
fi
node --version
npm --version
echo ""

# Create virtual environment if it doesn't exist
echo "[3/7] Setting up Python virtual environment..."
if [ ! -d "venv" ]; then
    echo "Creating new virtual environment..."
    python3 -m venv venv
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to create virtual environment!"
        exit 1
    fi
    echo "Virtual environment created!"
else
    echo "Virtual environment already exists!"
fi
echo ""

# Activate virtual environment and install Python dependencies
echo "[4/7] Installing Python dependencies..."
source venv/bin/activate
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to activate virtual environment!"
    exit 1
fi
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install Python dependencies!"
    exit 1
fi
echo "Python dependencies installed!"
echo ""

# Install Node.js dependencies
echo "[5/7] Installing Node.js dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install Node.js dependencies!"
    exit 1
fi
echo "Node.js dependencies installed!"
echo ""

# Initialize database
echo "[6/7] Initializing database..."
if [ -f "server_py/init_database.py" ]; then
    cd server_py
    python init_database.py
    if [ $? -ne 0 ]; then
        echo "WARNING: Database initialization had issues, but continuing..."
    else
        echo "Database initialized!"
    fi
    cd ..
else
    echo "Database initialization script not found, skipping..."
fi
echo ""

# Final success message
echo "[7/7] Verifying installation..."
pip list | grep -E "fastapi|uvicorn"
echo ""

echo "========================================"
echo "Installation Complete!"
echo "========================================"
echo ""
echo "All dependencies have been installed successfully!"
echo ""
echo "TO RUN THE APP:"
echo ""
echo "  Option 1 (Easiest):"
echo "  -------------------"
echo "  Terminal 1: ./start-python-backend.sh"
echo "  Terminal 2: npm run dev"
echo ""
echo "  Option 2 (Manual):"
echo "  ------------------"
echo "  Terminal 1: source venv/bin/activate"
echo "              cd server_py"
echo "              python run.py"
echo ""
echo "  Terminal 2: npm run dev"
echo ""
echo "Then open: http://localhost:5173"
echo "API Docs:  http://localhost:8000/docs"
echo ""
echo "========================================"
