# Beach Cleanup App - Quick Reference Card

## 🚀 Daily Development

### Start Both Servers

```bash
# Terminal 1 - Backend (port 8000)
cd server_py
python3 -m uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2 - Frontend (port 5173)
npm run dev
```

### Access Points

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **Backend Docs:** http://localhost:8000/docs
- **Health Check:** http://localhost:8000/health

## 📁 Important File Locations

```
beach-cleanup-app/
├── .env                              ← Environment variables (DO NOT COMMIT)
├── server_py/
│   └── ocean-cleanup-service-account.json  ← Service account (DO NOT COMMIT)
├── cors.json                         ← Firebase Storage CORS config
├── src/
│   ├── services/
│   │   ├── firebase.js              ← Firebase initialization
│   │   ├── imageUpload.js           ← Image upload logic
│   │   └── googleSheets.js          ← Google Sheets API
│   └── components/
│       └── ui/
│           ├── UploadPostModal.jsx  ← Post upload UI
│           └── CleanupPost.jsx      ← Post display
└── TEAM_SETUP.md                    ← Full setup instructions
```

## 🔧 Common Commands

```bash
# Install dependencies
npm install
cd server_py && pip3 install -r ../requirements.txt

# Run verification script
./verify-setup.sh

# Build for production
npm run build

# Lint code
npm run lint

# Kill backend server
lsof -ti:8000 | xargs kill
```

## 🐛 Quick Troubleshooting

### Images Not Loading
```bash
# Set CORS on Firebase Storage
gsutil cors set cors.json gs://ocean-cleanup-476302.firebasestorage.app

# Verify CORS
gsutil cors get gs://ocean-cleanup-476302.firebasestorage.app
```

### Backend Won't Start
```bash
# Check if port is in use
lsof -i:8000

# Kill process on port 8000
lsof -ti:8000 | xargs kill

# Reinstall dependencies
cd server_py
pip3 install -r ../requirements.txt
```

### Frontend Won't Start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### "Module Not Found" Errors
```bash
# Backend
cd server_py
pip3 install -r ../requirements.txt

# Frontend
npm install
```

## 🔑 Required Environment Variables

### Backend (`server_py` needs these)
```bash
FIREBASE_PROJECT_ID=ocean-cleanup-476302
FIREBASE_PRIVATE_KEY="..."
FIREBASE_CLIENT_EMAIL=...
```

### Frontend (React app needs these with `VITE_` prefix)
```bash
VITE_FIREBASE_PROJECT_ID=ocean-cleanup-476302
VITE_FIREBASE_STORAGE_BUCKET=ocean-cleanup-476302.firebasestorage.app
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

VITE_GOOGLE_SHEETS_API_KEY=...
VITE_GOOGLE_SHEETS_SPREADSHEET_ID=...
VITE_GOOGLE_SHEETS_SHEET_NAME=Posts
```

## 🔐 Security Checklist

### Before Every Commit
- [ ] Run `git status` and check no `.env` or `.json` credentials are staged
- [ ] Don't commit `node_modules/` or `__pycache__/`
- [ ] Don't include API keys in code comments

### When Sharing Credentials
- ✅ Use encrypted messaging
- ✅ Use password managers
- ❌ Never email credentials
- ❌ Never paste in Slack/Discord public channels
- ❌ Never commit to Git

## 📊 Data Flow

### Upload Post with Image
```
User selects image
  ↓
Frontend compresses image
  ↓
Upload to Firebase Storage
  ↓
Get Firebase URL
  ↓
Send post data + URL to Backend (port 8000)
  ↓
Backend saves to Google Sheets
  ↓
Frontend refreshes feed
  ↓
Images load from Firebase (with CORS)
```

### View Posts
```
Frontend fetches from Google Sheets API
  ↓
Parse post data with Firebase image URLs
  ↓
Browser loads images from Firebase Storage
  ↓
CORS allows cross-origin image loading
```

## 🌐 External Services

### Google Cloud Console
- **Project:** ocean-cleanup-476302
- **Console:** https://console.cloud.google.com/
- **APIs Enabled:** Google Sheets API

### Firebase Console
- **Project:** ocean-cleanup-476302
- **Console:** https://console.firebase.google.com/project/ocean-cleanup-476302
- **Storage:** https://console.firebase.google.com/project/ocean-cleanup-476302/storage
- **Storage Bucket:** `ocean-cleanup-476302.firebasestorage.app`

### Google Sheet
- **ID:** `1L5Ufho432M3KiF21JFbCSkDCsoqj8KMEntVNmvKpJOg`
- **Sheet Name:** Posts
- **Columns:** ID | Username | Location | Date | Image URL | Caption | Trash Collected | Upvotes | Timestamp

## 📱 Testing Checklist

- [ ] Backend health check responds: `curl http://localhost:8000/health`
- [ ] Can view homepage at http://localhost:5173
- [ ] Can create an account
- [ ] Can upload a post with an image
- [ ] Image appears in the feed
- [ ] Post data appears in Google Sheet
- [ ] Can upvote posts
- [ ] Upvote count updates in Google Sheet

## 🆘 Getting Help

1. Check [TEAM_SETUP.md](TEAM_SETUP.md) for full setup instructions
2. Check [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) for deployment info
3. Run `./verify-setup.sh` to check your setup
4. Check browser console (F12) for frontend errors
5. Check backend terminal for API errors
6. Ask in team chat

## 📝 Useful Links

- **Main Docs:** [README.md](README.md)
- **Team Setup:** [TEAM_SETUP.md](TEAM_SETUP.md)
- **Deployment:** [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
- **Firebase Docs:** https://firebase.google.com/docs/storage
- **FastAPI Docs:** https://fastapi.tiangolo.com/
- **Vite Docs:** https://vitejs.dev/

---

**Pro Tip:** Keep this file open in a separate window while developing!
