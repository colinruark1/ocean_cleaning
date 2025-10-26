# Beach Cleanup App - Team Setup Guide

This guide will help your team members set up the development environment to work on the Beach Cleanup App.

## Prerequisites

- Node.js 20.x or higher
- Python 3.12 or higher
- Git
- Google Cloud SDK (for CORS configuration)

## Quick Start

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd beach-cleanup-app

# Install frontend dependencies
npm install

# Install backend dependencies (Python)
cd server_py
pip3 install -r ../requirements.txt
cd ..
```

### 2. Get Environment Variables

**Ask the project owner for the `.env` file** with all the credentials, or follow the detailed setup below.

The `.env` file should be placed in the `beach-cleanup-app/` directory (root of the project).

### 3. Get Service Account JSON File

**Ask the project owner for:** `ocean-cleanup-service-account.json`

Place it in: `beach-cleanup-app/server_py/ocean-cleanup-service-account.json`

This file contains credentials for the backend to access Google Sheets.

### 4. Start the Backend Server

```bash
# From the beach-cleanup-app directory
cd server_py
python3 -m uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
```

Or use the startup script:
```bash
./start-python-backend.sh
```

You should see:
```
✅ Google Sheets service initialized successfully (from JSON file)
Beach Cleanup API Server (Python/FastAPI)
Running on: http://localhost:8000
```

### 5. Start the Frontend Dev Server

In a **new terminal**:

```bash
# From the beach-cleanup-app directory
npm run dev
```

The app will be available at: http://localhost:5173

## Required Credentials

### What You Need from Project Owner:

1. **`.env` file** - Contains all API keys and configuration
2. **`ocean-cleanup-service-account.json`** - Backend service account credentials

### Environment Variables Needed:

```bash
# Google Sheets (for storing posts)
VITE_GOOGLE_SHEETS_API_KEY=
VITE_GOOGLE_SHEETS_SPREADSHEET_ID=
VITE_GOOGLE_SHEETS_SHEET_NAME=Posts

# Firebase (for image uploads)
VITE_FIREBASE_PROJECT_ID=ocean-cleanup-476302
VITE_FIREBASE_STORAGE_BUCKET=ocean-cleanup-476302.firebasestorage.app
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Backend credentials
FIREBASE_PROJECT_ID=ocean-cleanup-476302
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
```

## Testing Your Setup

### 1. Check Backend is Running

Visit: http://localhost:8000/health

You should see:
```json
{"status":"ok","timestamp":"..."}
```

### 2. Check Frontend is Running

Visit: http://localhost:5173

You should see the Beach Cleanup App homepage.

### 3. Test Image Upload

1. Create an account or log in
2. Click "Share Post"
3. Upload an image
4. Fill in the details
5. Submit

The post should appear in the feed with the image visible.

## Troubleshooting

### Images Not Loading

**Problem:** Images show "Image unavailable"

**Solution:** The CORS configuration might not be set on Firebase Storage.

Ask the project owner to run:
```bash
cd beach-cleanup-app
gsutil cors set cors.json gs://ocean-cleanup-476302.firebasestorage.app
```

### Backend Not Connecting to Google Sheets

**Problem:** `❌ Error initializing Google Sheets service`

**Solutions:**
1. Make sure `ocean-cleanup-service-account.json` is in the `server_py/` directory
2. Verify the Google Sheets API is enabled in the Google Cloud project
3. Check that the service account email has access to the Google Sheet

### "Port 8000 already in use"

**Problem:** Backend won't start because port is already taken

**Solution:**
```bash
# Find and kill the process using port 8000
lsof -ti:8000 | xargs kill

# Or on Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Module Not Found Errors

**Problem:** Python modules not found when starting backend

**Solution:**
```bash
cd server_py
pip3 install -r ../requirements.txt
```

## Development Workflow

### Starting Work
```bash
# Terminal 1 - Backend
cd server_py
python3 -m uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2 - Frontend
npm run dev
```

### Before Pushing Code

1. Test image upload functionality
2. Check that posts appear in the feed
3. Verify backend is working: http://localhost:8000/health
4. Make sure no credentials are in your commits

### What NOT to Commit

- `.env` file (contains secrets)
- `ocean-cleanup-service-account.json` (contains credentials)
- `node_modules/`
- `__pycache__/`
- `.DS_Store`

These are already in `.gitignore`, but double-check before committing!

## Architecture Overview

### Frontend (React + Vite)
- Port: 5173
- Framework: React 18
- Styling: Tailwind CSS
- Image Upload: Firebase Storage
- Posts Display: Fetches from Google Sheets

### Backend (Python + FastAPI)
- Port: 8000
- Framework: FastAPI
- Database: Google Sheets (via API)
- Image Storage: Firebase Storage
- Authentication: Service Account

### Data Flow

1. **Upload Post:**
   - User uploads image → Frontend compresses it
   - Image uploaded to Firebase Storage
   - Firebase returns public URL
   - Post data (with image URL) sent to Backend
   - Backend saves to Google Sheets

2. **View Posts:**
   - Frontend fetches posts from Google Sheets API
   - Posts displayed with images from Firebase Storage
   - CORS allows browser to load images

## Common Commands

```bash
# Install dependencies
npm install
pip3 install -r requirements.txt

# Start frontend dev server
npm run dev

# Start backend server
cd server_py && python3 -m uvicorn src.main:app --reload

# Build frontend for production
npm run build

# Check linting
npm run lint
```

## Getting Help

- Check the main [README.md](README.md) for general information
- Check [SETUP.md](SETUP.md) for detailed Firebase setup
- Ask in the team chat if you're stuck
- Check browser console for frontend errors
- Check backend terminal for API errors

## Project Owner Responsibilities

When a new team member joins, provide them with:

1. **`.env` file** - Send via secure channel (not email!)
2. **`ocean-cleanup-service-account.json`** - Send via secure channel
3. Access to:
   - GitHub repository
   - Google Sheet (viewer access)
   - Google Cloud Console (optional, for debugging)

## Security Notes

⚠️ **IMPORTANT:**
- Never commit `.env` or service account JSON files
- Don't share credentials in public channels
- Use secure methods to transfer credentials (encrypted chat, password managers)
- Rotate keys if they're accidentally exposed

---

**Questions?** Contact the project owner or check the documentation in the `docs/` folder.
