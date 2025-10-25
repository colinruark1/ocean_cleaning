# LowTides Implementation - Migration Checklist

This document lists all files needed to migrate the LowTides notification system to another repository.

## Required Files

### 1. Core Backend Files (LowTides Directory)
Copy the entire `LowTides/` directory:

```
LowTides/
├── run_notification_logic.cjs       # Main notification script
├── mock_tides.json                  # Test tide data
├── fcm_token_getter.html            # Token generation tool
├── firebase-messaging-sw.js         # Service worker (for token getter)
├── TESTING_GUIDE.md                 # Step-by-step testing instructions
├── README.md                        # System overview
└── MIGRATION_CHECKLIST.md           # This file
```

### 2. Frontend Service Worker
```
public/
└── firebase-messaging-sw.js         # Service worker for React app notifications
```

### 3. React Integration (Optional - for future use)
```
src/
└── lib/
    └── firebase-messaging.ts        # Firebase messaging utilities for React
```

### 4. Environment Configuration
```
.env                                 # Firebase credentials (ROOT of project)
```

**Important:** The `.env` file should contain:
```
"FIREBASE_PROJECT_ID": "shore-connect"
"FIREBASE_CLIENT_EMAIL": "firebase-adminsdk-fbsvc@shore-connect.iam.gserviceaccount.com"
"FIREBASE_PRIVATE_KEY": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

## Dependencies to Install

Add these to your `package.json`:

```json
{
  "dependencies": {
    "firebase": "^12.4.0",
    "firebase-admin": "^13.5.0"
  }
}
```

Then run:
```bash
npm install firebase firebase-admin
```

## Firebase Console Setup Required

You'll need to set up Firebase in the new repo's Firebase project:

### 1. Create/Use Firebase Project
- Go to https://console.firebase.google.com
- Create a new project OR use existing project
- Note the project ID

### 2. Get Service Account Credentials
- Firebase Console → Project Settings (gear icon)
- Service Accounts tab
- Click "Generate new private key"
- Save the JSON file
- Extract these values for your `.env`:
  - `project_id`
  - `client_email`
  - `private_key`

### 3. Enable Cloud Messaging
- Firebase Console → Build → Cloud Messaging
- Make sure Cloud Messaging API is enabled

### 4. Generate Web Push Certificate (VAPID Key)
- Firebase Console → Project Settings
- Cloud Messaging tab
- Scroll to "Web Push certificates"
- Click "Generate key pair"
- Save this VAPID key (you'll need it to get FCM tokens)

### 5. Get Your FCM Token
- Open `LowTides/fcm_token_getter.html` in browser (via local server)
- Paste your VAPID key
- Get your FCM token
- Add it to `run_notification_logic.cjs` line 77

## File Structure in New Repo

```
new-repo/
├── .env                              # Firebase credentials (update with new project)
├── package.json                      # Add firebase dependencies
├── LowTides/                         # Copy entire directory
│   ├── run_notification_logic.cjs
│   ├── mock_tides.json
│   ├── fcm_token_getter.html
│   ├── firebase-messaging-sw.js
│   ├── TESTING_GUIDE.md
│   ├── README.md
│   └── MIGRATION_CHECKLIST.md
├── public/                           # If using React/Vite
│   └── firebase-messaging-sw.js
└── src/                              # If using React
    └── lib/
        └── firebase-messaging.ts
```

## Configuration Updates Needed

### 1. Update Firebase Config in Files

You'll need to update Firebase configuration in these files with your new project's config:

**Files to update:**
- `LowTides/fcm_token_getter.html` (lines 67-75)
- `LowTides/firebase-messaging-sw.js` (lines 8-16)
- `public/firebase-messaging-sw.js` (lines 8-16)
- `src/lib/firebase-messaging.ts` (lines 6-13)

**New config format:**
```javascript
const firebaseConfig = {
  apiKey: "YOUR_NEW_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

Get this from: Firebase Console → Project Settings → General → Your apps → Web app

### 2. Update .env File
Replace the Firebase service account credentials with your new project's credentials.

### 3. Update FCM Token
- Generate a new FCM token using `fcm_token_getter.html`
- Update `run_notification_logic.cjs` line 77

### 4. Update Mock Tide Time
- Edit `mock_tides.json`
- Set low tide time to within next 60 minutes (UTC)

## Quick Migration Steps

### Step 1: Copy Files
```bash
# From shore-connect-app repo
cp -r LowTides /path/to/new-repo/
cp public/firebase-messaging-sw.js /path/to/new-repo/public/
cp src/lib/firebase-messaging.ts /path/to/new-repo/src/lib/
cp .env /path/to/new-repo/.env
```

### Step 2: Install Dependencies
```bash
cd /path/to/new-repo
npm install firebase firebase-admin
```

### Step 3: Set Up Firebase Project
1. Create Firebase project (or use existing)
2. Get service account credentials
3. Generate VAPID key
4. Update all Firebase configs in copied files

### Step 4: Update Configuration
1. Update `.env` with new Firebase credentials
2. Update `firebaseConfig` in 4 files (listed above)
3. Generate new FCM token with `fcm_token_getter.html`
4. Update `run_notification_logic.cjs` with new token
5. Update `mock_tides.json` with current time + 30 min

### Step 5: Test
```bash
# From new repo root
node LowTides/run_notification_logic.cjs
```

## Minimal Migration (Backend Only)

If you only need the notification backend (no React integration):

**Required files:**
```
LowTides/run_notification_logic.cjs
LowTides/mock_tides.json
LowTides/fcm_token_getter.html
LowTides/firebase-messaging-sw.js
LowTides/TESTING_GUIDE.md
.env
```

**Skip:**
- `public/firebase-messaging-sw.js` (only needed for React app)
- `src/lib/firebase-messaging.ts` (only needed for React app)

## Common Issues After Migration

### Issue: "Cannot find module 'firebase-admin'"
**Solution:** Run `npm install firebase-admin`

### Issue: "ERROR: Could not parse Firebase credentials"
**Solution:** Check that `.env` file has correct format with quotes around values

### Issue: "Invalid VAPID key"
**Solution:** Make sure you generated a new VAPID key for the new Firebase project

### Issue: No notification received
**Solution:**
- Generate a NEW FCM token (old tokens won't work with new project)
- Update the token in `run_notification_logic.cjs`
- Make sure browser is open to the token getter page

## Testing After Migration

1. **Test token generation:**
   ```bash
   cd LowTides
   python3 -m http.server 8000
   # Open http://localhost:8000/fcm_token_getter.html
   ```

2. **Test notification script:**
   ```bash
   node LowTides/run_notification_logic.cjs
   ```

3. **Verify notification appears in browser**

## Support

If you run into issues:
1. Check Firebase Console for any error messages
2. Check browser console (F12) for errors
3. Verify all Firebase configs match your new project
4. Make sure FCM token is fresh (regenerate if needed)

## Summary

**Minimum files to copy:** 6 files (LowTides directory + .env)
**Configuration updates needed:** 4-5 files (Firebase configs + credentials)
**Time to migrate:** ~15-30 minutes (including Firebase setup)
**Testing time:** ~5 minutes

Good luck with your migration! 🚀