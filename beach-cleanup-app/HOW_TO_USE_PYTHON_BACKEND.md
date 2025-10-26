# How to Use the Python Backend with Virtual Environment

## Overview

Your beach-cleanup-app now has **TWO backend options**:

1. **Node.js Backend** (original) - in `/server/` folder
2. **Python Backend** (new) - in `/server_py/` folder ✨

Both do the same thing, but the Python backend works with your virtual environment!

## Quick Start Guide

### Step 1: Activate Virtual Environment

Open a terminal in the `beach-cleanup-app` folder:

**Windows:**
```bash
venv\Scripts\activate
```

**Mac/Linux:**
```bash
source venv/bin/activate
```

You'll see `(venv)` in your terminal prompt.

### Step 2: Verify Dependencies

Dependencies are already installed! To check:

```bash
pip list
```

You should see FastAPI, uvicorn, and other packages.

### Step 3: Initialize the Database

```bash
cd server_py
python init_database.py
```

This creates the SQLite database with all tables.

### Step 4: Run the Python Backend

```bash
python run.py
```

You should see:

```
==============================================================
  Beach Cleanup API Server (Python/FastAPI)
  Running on: http://localhost:8000
  Environment: development
  API Docs: http://localhost:8000/docs
  Health Check: http://localhost:8000/health
==============================================================
```

### Step 5: Test the API

Open your browser to:

- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

Try the interactive API docs to test registration and login!

## Running the Full Application

### Option 1: Python Backend (Recommended)

**Terminal 1 - Python Backend:**
```bash
cd beach-cleanup-app
venv\Scripts\activate          # Windows
cd server_py
python run.py
# Server runs on http://localhost:8000
```

**Terminal 2 - Frontend:**
```bash
cd beach-cleanup-app
npm run dev
# Frontend runs on http://localhost:5173
```

### Option 2: Node.js Backend (Original)

**Terminal 1 - Node.js Backend:**
```bash
cd beach-cleanup-app/server
npm start
# Server runs on http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
cd beach-cleanup-app
npm run dev
# Frontend runs on http://localhost:5173
```

## What's Different?

### Python Backend
- ✅ Uses your virtual environment
- ✅ Run with `pip install` and Python commands
- ✅ Automatic API documentation at `/docs`
- ✅ Type-safe with Pydantic
- ✅ Modern FastAPI framework
- Port: **8000**

### Node.js Backend
- Uses npm/Node.js
- Run with `npm install` and `npm start`
- Express.js framework
- Port: **3000**

## For New Users Installing Your App

### Python Backend Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd beach-cleanup-app
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv venv

   # Windows
   venv\Scripts\activate

   # Mac/Linux
   source venv/bin/activate
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Install frontend dependencies**
   ```bash
   npm install
   ```

5. **Initialize database**
   ```bash
   cd server_py
   python init_database.py
   cd ..
   ```

6. **Set up environment**
   ```bash
   cd server_py
   cp .env.example .env
   # Edit .env with your configuration
   cd ..
   ```

7. **Run the application**

   Terminal 1 (Backend):
   ```bash
   cd server_py
   python run.py
   ```

   Terminal 2 (Frontend):
   ```bash
   npm run dev
   ```

## Configuration

### Frontend API URL

If using Python backend, update the frontend to use port 8000:

In your frontend code, change API base URL from:
```
http://localhost:3000
```

to:
```
http://localhost:8000
```

### Environment Variables

Python backend (server_py/.env):
```env
PORT=8000
ENV=development
DATABASE_PATH=database.db
JWT_SECRET=your-secret-key
CORS_ORIGINS=http://localhost:5173
```

## API Endpoints

Both backends provide the same endpoints:

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user

### Coming Soon (add as you convert)
- User management
- Events
- Posts
- Social features

## Troubleshooting

### "Module not found" error

Make sure virtual environment is activated:
```bash
# You should see (venv) in your prompt
venv\Scripts\activate
```

### Port 8000 already in use

Change port in `server_py/.env`:
```env
PORT=8001
```

### Database errors

Reinitialize database:
```bash
cd server_py
rm database.db
python init_database.py
```

### Can't activate venv

Make sure it exists:
```bash
python -m venv venv
```

## Next Steps

The Python backend currently has:
- ✅ User registration
- ✅ User login
- ✅ JWT authentication
- ✅ Database setup

To add more features, you can:
1. Add more controllers in `server_py/src/controllers/`
2. Add more routes in `server_py/src/routes/`
3. Update schemas in `server_py/src/models/schemas.py`

Check `server_py/README.md` for detailed developer documentation.

## Summary

**To run your app with Python:**

```bash
# Terminal 1
venv\Scripts\activate
cd server_py
python run.py

# Terminal 2
npm run dev
```

**To let others use your app:**

Share the repository with `requirements.txt` and they can:
1. Create a venv
2. Run `pip install -r requirements.txt`
3. Follow the steps above

That's it! Your app now works with Python and the virtual environment! 🎉
