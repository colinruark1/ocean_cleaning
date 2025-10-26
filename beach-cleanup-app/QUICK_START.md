# 🚀 Quick Start - Beach Cleanup App

## Run Python Backend (Easiest Way)

### Windows
Double-click: **`start-python-backend.bat`**

### Mac/Linux
```bash
./start-python-backend.sh
```

**That's it!** The server will start on http://localhost:8000

---

## Manual Commands

### Python Backend
```bash
venv\Scripts\activate          # Windows
cd server_py
python run.py
```

### Node.js Backend
```bash
cd server
npm start
```

### Frontend
```bash
npm run dev
```

---

## Ports

- **Python Backend**: http://localhost:8000
  - API Docs: http://localhost:8000/docs ✨

- **Node.js Backend**: http://localhost:3000

- **Frontend**: http://localhost:5173

---

## Test the API

1. Start Python backend
2. Open http://localhost:8000/docs
3. Try `POST /api/v1/auth/register`
4. Register a test user
5. Get JWT token back!

---

## For New Users

```bash
# 1. Clone & enter directory
git clone <repo-url>
cd beach-cleanup-app

# 2. Create virtual environment
python -m venv venv

# 3. Activate it
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux

# 4. Install Python dependencies
pip install -r requirements.txt

# 5. Install Node dependencies
npm install

# 6. Run Python backend
cd server_py
python init_database.py
python run.py
```

---

## Files Overview

| File/Folder | Purpose |
|-------------|---------|
| `venv/` | Virtual environment with Python packages |
| `requirements.txt` | Python dependencies list |
| `server_py/` | Python/FastAPI backend (NEW) |
| `server/` | Node.js/Express backend (ORIGINAL) |
| `src/` | React frontend |
| `start-python-backend.bat` | Windows starter script |
| `start-python-backend.sh` | Mac/Linux starter script |

---

## Documentation

- **This File**: Quick reference
- **SETUP.md**: Complete setup guide
- **HOW_TO_USE_PYTHON_BACKEND.md**: Detailed Python backend guide
- **CONVERSION_SUMMARY.md**: What was converted from Node.js
- **server_py/README.md**: Python backend technical docs

---

## Installed Python Packages

✅ fastapi (0.120.0) - Web framework
✅ uvicorn (0.38.0) - ASGI server
✅ python-jose (3.5.0) - JWT tokens
✅ passlib (1.7.4) - Password hashing
✅ bcrypt (5.0.0) - Bcrypt algorithm
✅ aiosqlite (0.21.0) - Async database
✅ pydantic (2.12.3) - Data validation
✅ email-validator (2.3.0) - Email validation

**Total: 35 packages installed**

---

## Need Help?

1. Check `SETUP.md` for detailed instructions
2. Check `HOW_TO_USE_PYTHON_BACKEND.md` for Python backend guide
3. Visit http://localhost:8000/docs for API documentation
4. Check `server_py/README.md` for technical details

---

**Ready to go! 🎉**
