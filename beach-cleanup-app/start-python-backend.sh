#!/bin/bash

echo "============================================================"
echo "  Beach Cleanup App - Python Backend Starter"
echo "============================================================"
echo ""

# Check if venv exists
if [ ! -f "venv/bin/activate" ]; then
    echo "ERROR: Virtual environment not found!"
    echo "Please create it first: python -m venv venv"
    echo ""
    exit 1
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo ""
echo "Checking Python dependencies..."
python -c "import fastapi" 2>/dev/null
if [ $? -ne 0 ]; then
    echo ""
    echo "Installing dependencies..."
    pip install -r requirements.txt
fi

echo ""
echo "Changing to server directory..."
cd server_py

echo ""
echo "Checking if database exists..."
if [ ! -f "database.db" ]; then
    echo "Database not found. Initializing..."
    python init_database.py
fi

echo ""
echo "============================================================"
echo "  Starting Python Backend Server..."
echo "  API Docs: http://localhost:8000/docs"
echo "  Press CTRL+C to stop"
echo "============================================================"
echo ""

python run.py
