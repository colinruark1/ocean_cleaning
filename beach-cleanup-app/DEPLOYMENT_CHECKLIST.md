# Deployment Checklist - Before Your Team Pulls

This checklist ensures your team can successfully run the app after pulling from the repository.

## ✅ Pre-Push Checklist (Project Owner)

### 1. Verify All Services Are Working

- [ ] Backend is running on port 8000
- [ ] Frontend is running and can upload images
- [ ] Images are visible in the feed
- [ ] Posts are being saved to Google Sheets
- [ ] CORS is configured on Firebase Storage

### 2. Prepare Credentials for Team

**Create a secure credential package with:**

#### File 1: `.env`
Location: `beach-cleanup-app/.env`

```bash
# Copy your working .env file
cp .env .env.team-template

# IMPORTANT: Share the actual .env file with values filled in
# Send via: Encrypted chat, password manager, secure file share
```

#### File 2: `ocean-cleanup-service-account.json`
Location: `beach-cleanup-app/server_py/ocean-cleanup-service-account.json`

This is the service account JSON you downloaded from Google Cloud Console.

**Send this securely** - Never commit it to Git!

### 3. Configure Firebase Storage CORS (One-Time Setup)

If not already done, run:

```bash
cd beach-cleanup-app
gsutil cors set cors.json gs://ocean-cleanup-476302.firebasestorage.app
```

Verify CORS is set:
```bash
gsutil cors get gs://ocean-cleanup-476302.firebasestorage.app
```

### 4. Share Google Sheet Access

Give team members **Viewer** access to the Google Sheet:
- Sheet ID: `1L5Ufho432M3KiF21JFbCSkDCsoqj8KMEntVNmvKpJOg`
- URL: https://docs.google.com/spreadsheets/d/1L5Ufho432M3KiF21JFbCSkDCsoqj8KMEntVNmvKpJOg

They need to see it to understand the data structure.

### 5. Verify Firebase Storage Permissions

Check that Firebase Storage Security Rules allow read/write:

**Firebase Console:** https://console.firebase.google.com/project/ocean-cleanup-476302/storage/rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;  // Anyone can read
      allow write: if true; // Anyone can write (consider auth later)
    }
  }
}
```

### 6. Document What to Send

Create a secure message with:

```
Hi Team! 👋

To run the Beach Cleanup App locally, you'll need:

1. **Environment file (.env)**
   [Attach or link to .env file securely]
   Place in: beach-cleanup-app/.env

2. **Service Account JSON**
   [Attach ocean-cleanup-service-account.json securely]
   Place in: beach-cleanup-app/server_py/ocean-cleanup-service-account.json

3. **Setup Instructions**
   Follow TEAM_SETUP.md in the repository

4. **Google Sheet Access**
   You've been added as a viewer to the Google Sheet

Let me know if you have any issues!
```

## ✅ What's Safe to Commit

These are already in the repo and safe to push:

- [ ] `package.json` and `package-lock.json`
- [ ] `requirements.txt`
- [ ] Source code (`.jsx`, `.js`, `.py` files)
- [ ] `.env.example` (template without real values)
- [ ] `.gitignore` (prevents credential commits)
- [ ] `TEAM_SETUP.md`
- [ ] `cors.json` (CORS configuration template)
- [ ] `README.md` and other documentation

## ❌ What NOT to Commit

These should NEVER be in Git:

- [ ] `.env` (contains API keys)
- [ ] `ocean-cleanup-service-account.json` (service account credentials)
- [ ] `node_modules/` (too large)
- [ ] `__pycache__/` (Python cache)
- [ ] `.DS_Store` (Mac system file)
- [ ] `database.db` (local database)

Run this before committing:
```bash
git status
# Check nothing sensitive is staged
```

## 🔒 Security Best Practices

### When Sharing Credentials

**DO:**
- ✅ Use encrypted messaging (Signal, ProtonMail)
- ✅ Use password managers with sharing (1Password, Bitwarden)
- ✅ Use secure file sharing (Tresorit, SpiderOak)
- ✅ Expire shared links after team downloads

**DON'T:**
- ❌ Email credentials
- ❌ Paste in Slack/Discord
- ❌ Commit to Git
- ❌ Share in public channels
- ❌ Take screenshots with credentials

### Credential Rotation

If credentials are exposed:
1. Generate new service account in Google Cloud
2. Create new Firebase API key
3. Update `.env` for all team members
4. Revoke old credentials

## 📋 Team Member Onboarding Checklist

Send this checklist to new team members:

```
Beach Cleanup App Setup Checklist:

Prerequisites:
[ ] Node.js 20+ installed
[ ] Python 3.12+ installed
[ ] Git installed
[ ] Google Cloud SDK installed (for CORS if needed)

Setup Steps:
[ ] Clone repository
[ ] Received .env file from project owner
[ ] Received ocean-cleanup-service-account.json file
[ ] Placed .env in beach-cleanup-app/
[ ] Placed service account JSON in beach-cleanup-app/server_py/
[ ] Ran: npm install
[ ] Ran: cd server_py && pip3 install -r ../requirements.txt
[ ] Started backend: cd server_py && python3 -m uvicorn src.main:app --reload
[ ] Started frontend: npm run dev
[ ] Tested: Can see homepage at localhost:5173
[ ] Tested: Backend health check at localhost:8000/health
[ ] Tested: Can upload an image and see it in the feed

Troubleshooting:
[ ] Read TEAM_SETUP.md
[ ] Checked browser console for errors
[ ] Checked backend terminal for errors
[ ] Asked for help in team chat if stuck
```

## 🚀 Quick Verification Script

Run this after setup to verify everything is working:

```bash
#!/bin/bash
# verify-setup.sh

echo "🔍 Verifying Beach Cleanup App Setup..."

# Check if .env exists
if [ -f ".env" ]; then
    echo "✅ .env file found"
else
    echo "❌ .env file missing"
    exit 1
fi

# Check if service account exists
if [ -f "server_py/ocean-cleanup-service-account.json" ]; then
    echo "✅ Service account JSON found"
else
    echo "❌ Service account JSON missing"
    exit 1
fi

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo "✅ Node modules installed"
else
    echo "⚠️  Run: npm install"
fi

# Check if backend dependencies are installed
cd server_py
if python3 -c "import fastapi, uvicorn" 2>/dev/null; then
    echo "✅ Python dependencies installed"
else
    echo "⚠️  Run: pip3 install -r requirements.txt"
fi
cd ..

echo ""
echo "🎉 Setup verification complete!"
echo ""
echo "Next steps:"
echo "1. Terminal 1: cd server_py && python3 -m uvicorn src.main:app --reload"
echo "2. Terminal 2: npm run dev"
```

Save this as `verify-setup.sh` and share with team members.

## 📞 Support

If team members have issues:
1. Check TEAM_SETUP.md
2. Verify all files are in correct locations
3. Check terminal output for errors
4. Review this checklist
5. Contact project owner

---

**Ready to push?** Make sure you've:
- ✅ Not committed any credentials
- ✅ Prepared credential files for team
- ✅ Written onboarding message
- ✅ Tested the setup process yourself
