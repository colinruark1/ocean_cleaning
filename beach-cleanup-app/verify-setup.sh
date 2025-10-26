#!/bin/bash
# Beach Cleanup App - Setup Verification Script
# Run this after cloning to verify your local setup

echo "🔍 Verifying Beach Cleanup App Setup..."
echo ""

ERRORS=0

# Check if .env exists
echo "Checking environment configuration..."
if [ -f ".env" ]; then
    echo "  ✅ .env file found"

    # Check if it has required variables
    if grep -q "VITE_FIREBASE_API_KEY" .env && ! grep -q "YOUR_FIREBASE_API_KEY_HERE" .env; then
        echo "  ✅ Firebase API key configured"
    else
        echo "  ❌ Firebase API key not configured in .env"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo "  ❌ .env file missing - copy from .env.example and fill in values"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "Checking service account credentials..."
# Check if service account exists
if [ -f "server_py/ocean-cleanup-service-account.json" ]; then
    echo "  ✅ Service account JSON found"
else
    echo "  ❌ Service account JSON missing"
    echo "     Expected location: server_py/ocean-cleanup-service-account.json"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "Checking dependencies..."
# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo "  ✅ Node modules installed"
else
    echo "  ⚠️  Node modules not installed - run: npm install"
    ERRORS=$((ERRORS + 1))
fi

# Check if backend dependencies are installed
cd server_py 2>/dev/null
if python3 -c "import fastapi, uvicorn, google, pydantic" 2>/dev/null; then
    echo "  ✅ Python dependencies installed"
else
    echo "  ⚠️  Python dependencies not installed"
    echo "     Run: cd server_py && pip3 install -r ../requirements.txt"
    ERRORS=$((ERRORS + 1))
fi
cd .. 2>/dev/null

echo ""
echo "Checking for Google Cloud SDK (needed for CORS setup)..."
if command -v gsutil &> /dev/null; then
    echo "  ✅ Google Cloud SDK (gsutil) found"
else
    echo "  ⚠️  Google Cloud SDK not found (optional)"
    echo "     Install: brew install google-cloud-sdk"
    echo "     Only needed if you need to configure Firebase Storage CORS"
fi

echo ""
echo "================================"
if [ $ERRORS -eq 0 ]; then
    echo "🎉 Setup verification complete - all checks passed!"
    echo ""
    echo "Next steps:"
    echo "  1. Terminal 1: cd server_py && python3 -m uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload"
    echo "  2. Terminal 2: npm run dev"
    echo "  3. Visit: http://localhost:5173"
else
    echo "❌ Setup verification found $ERRORS issue(s)"
    echo ""
    echo "Please fix the issues above and run this script again."
    echo "See TEAM_SETUP.md for detailed setup instructions."
    exit 1
fi
