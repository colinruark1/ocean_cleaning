# Welcome to the Beach Cleanup App Team! 🌊

## What You'll Receive from Me

To get started, you'll need **2 files** from me:

### 1. `.env` File
- Contains all API keys and configuration
- **Place in:** `beach-cleanup-app/.env` (root directory)
- **DO NOT** commit this file to Git!

### 2. `ocean-cleanup-service-account.json`
- Service account credentials for backend
- **Place in:** `beach-cleanup-app/server_py/ocean-cleanup-service-account.json`
- **DO NOT** commit this file to Git!

I'll send these via [secure method - fill in how you'll send them].

## Quick Start (5 Minutes)

```bash
# 1. Clone the repo
git clone [repository-url]
cd beach-cleanup-app

# 2. Add the 2 files I sent you:
# - .env → beach-cleanup-app/.env
# - ocean-cleanup-service-account.json → beach-cleanup-app/server_py/

# 3. Install dependencies
npm install
cd server_py && pip3 install -r ../requirements.txt && cd ..

# 4. Verify setup
./verify-setup.sh

# 5. Start backend (Terminal 1)
cd server_py
python3 -m uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload

# 6. Start frontend (Terminal 2)
npm run dev

# 7. Open browser
# Visit: http://localhost:5173
```

## Prerequisites You Need

Before starting, make sure you have:

- ✅ **Node.js 20+** - Check: `node --version`
- ✅ **Python 3.12+** - Check: `python3 --version`
- ✅ **Git** - Check: `git --version`
- ✅ **Google Cloud SDK** (optional, for CORS) - `brew install google-cloud-sdk`

## Testing Your Setup

After starting both servers, test that everything works:

### 1. Backend Health Check
```bash
curl http://localhost:8000/health
# Should return: {"status":"ok","timestamp":"..."}
```

### 2. Frontend
- Visit: http://localhost:5173
- You should see the Beach Cleanup App homepage

### 3. Upload Test
1. Create an account or log in
2. Click "Share Post"
3. Upload an image
4. Fill in location and caption
5. Submit

The post should appear in the feed with the image visible!

## Common Issues & Solutions

### "Images not loading"
The CORS configuration might need to be set. Let me know and I'll fix it.

### "Port 8000 already in use"
```bash
lsof -ti:8000 | xargs kill
```

### "Module not found" errors
```bash
# Backend
cd server_py && pip3 install -r ../requirements.txt

# Frontend
npm install
```

## Documentation

Once you're set up, check these docs:

- **[TEAM_SETUP.md](TEAM_SETUP.md)** - Detailed setup guide
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Commands and troubleshooting
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Deployment info
- **[README.md](README.md)** - Project overview

## Important Security Notes 🔐

**NEVER commit these files:**
- `.env`
- `ocean-cleanup-service-account.json`
- Any file with API keys or credentials

They're already in `.gitignore`, but double-check before committing!

Before every commit:
```bash
git status
# Make sure no sensitive files are staged!
```

## Development Workflow

### Daily Workflow
```bash
# Start work
Terminal 1: cd server_py && python3 -m uvicorn src.main:app --reload
Terminal 2: npm run dev

# Make changes...
# Test locally
# Commit (check no credentials!)
# Push
```

### Architecture
- **Frontend:** React + Vite (port 5173)
- **Backend:** Python FastAPI (port 8000)
- **Database:** Google Sheets
- **Image Storage:** Firebase Storage

## Getting Help

If you get stuck:

1. Run `./verify-setup.sh` to check your setup
2. Check [TEAM_SETUP.md](TEAM_SETUP.md) troubleshooting section
3. Check browser console (F12) for frontend errors
4. Check backend terminal for API errors
5. Ask in team chat - I'm happy to help!

## What You Have Access To

You can view (but not edit):
- **Google Sheet:** The database where posts are stored
  - https://docs.google.com/spreadsheets/d/1L5Ufho432M3KiF21JFbCSkDCsoqj8KMEntVNmvKpJOg

You don't need access to:
- Google Cloud Console (I'll handle that)
- Firebase Console (I'll handle that)

## Ready to Start?

1. Wait for me to send you the 2 credential files
2. Follow the "Quick Start" steps above
3. Run the verification script: `./verify-setup.sh`
4. Start coding! 🚀

Questions? Just ask!

---

**Welcome aboard! Let's build something amazing! 🌊🏖️**
