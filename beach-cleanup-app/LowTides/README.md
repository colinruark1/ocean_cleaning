# LowTides Notification System

A Firebase Cloud Messaging (FCM) based notification system that alerts users about upcoming low tides for beach cleanup opportunities.

## Current Status: Testing Ready

The system has been configured for testing with mock tide data. It's functional but requires manual setup steps.

## Quick Start

1. **Get VAPID Key** - Visit Firebase Console > Project Settings > Cloud Messaging > Web Push certificates
2. **Generate FCM Token** - Open `fcm_token_getter.html` in browser, paste VAPID key
3. **Configure Script** - Add your FCM token to `run_notification_logic.cjs` (line 54)
4. **Update Mock Data** - Set low tide time in `mock_tides.json` to within next 60 minutes
5. **Run** - Execute `node run_notification_logic.cjs`

For detailed instructions, see [TESTING_GUIDE.md](./TESTING_GUIDE.md)

## What's Working

- ✅ Firebase Admin SDK integration
- ✅ Environment configuration (reads from root `.env`)
- ✅ Service worker deployed to `/public`
- ✅ Mock tide data structure
- ✅ Notification sending logic
- ✅ Token generation tool
- ✅ Browser notification display

## What's Missing (For Production)

- ❌ Real tide API integration (NOAA, XTide, etc.)
- ❌ User database for FCM token storage
- ❌ Automated scheduling (cron job / Cloud Functions)
- ❌ Multi-user support
- ❌ Location/beach selection
- ❌ User preferences management
- ❌ React app notification integration

## Architecture

```
┌─────────────────┐
│  Browser Client │
│ (fcm_token_     │
│  getter.html)   │
└────────┬────────┘
         │ Generates FCM Token
         ▼
┌─────────────────┐
│   Firebase      │
│   Cloud         │◄───────┐
│   Messaging     │        │
└────────┬────────┘        │
         │                 │
         │ Push Notification
         │                 │
         ▼                 │
┌─────────────────┐        │
│  Service Worker │        │
│ (firebase-      │        │ Sends notification
│  messaging-sw)  │        │
└─────────────────┘        │
                           │
                  ┌────────┴────────┐
                  │   Backend       │
                  │   (run_         │
                  │   notification_ │
                  │   logic.cjs)    │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │  mock_tides.json│
                  │  (Test data)    │
                  └─────────────────┘
```

## Files Overview

### Core Components

- **run_notification_logic.cjs** - Node.js script that checks tide data and sends FCM notifications
- **fcm_token_getter.html** - Standalone web page to generate FCM tokens for testing
- **mock_tides.json** - Sample tide prediction data for testing

### Frontend Integration (Prepared but Not Active)

- **/public/firebase-messaging-sw.js** - Service worker for background notifications
- **/src/lib/firebase-messaging.ts** - React utilities for Firebase messaging (requires VAPID key)

### Configuration

- **/.env** - Firebase service account credentials (root directory)

### Documentation

- **TESTING_GUIDE.md** - Detailed step-by-step testing instructions
- **README.md** - This file

## How It Works

1. **Tide Check**: Script reads mock tide data and filters for low tides in next 60 minutes
2. **User Lookup**: Currently uses hardcoded test FCM token
3. **Notification Send**: Uses Firebase Admin SDK to send push notification
4. **Client Receive**: Browser/service worker receives and displays notification

## Testing Workflow

```bash
# 1. Get VAPID key from Firebase Console
# 2. Open fcm_token_getter.html, paste VAPID, get token
# 3. Edit run_notification_logic.cjs, add token
# 4. Update mock_tides.json with current time + 30 min

# 5. Run the script
node LowTides/run_notification_logic.cjs

# Expected: Browser shows notification
# "🌊 Low Tide Alert! 🌊"
# "Low tide is approaching at [time]. Time to clean!"
```

## Configuration Requirements

### Firebase Console Setup

1. Project: **shore-connect**
2. Cloud Messaging enabled
3. Web Push certificates generated (VAPID key)
4. Service account credentials in `.env`

### Environment File

Root `.env` file contains:
```
"FIREBASE_PROJECT_ID": "shore-connect"
"FIREBASE_CLIENT_EMAIL": "firebase-adminsdk-fbsvc@shore-connect.iam.gserviceaccount.com"
"FIREBASE_PRIVATE_KEY": "-----BEGIN PRIVATE KEY-----\n..."
```

## Development Roadmap

### Phase 1: Testing (Current)
- [x] Manual token generation
- [x] Mock data testing
- [x] Service worker deployment

### Phase 2: API Integration
- [ ] Connect to NOAA Tides & Currents API
- [ ] Implement data caching
- [ ] Schedule regular data fetches

### Phase 3: User Management
- [ ] Database setup (Supabase/Firebase)
- [ ] User registration/login
- [ ] FCM token storage per user
- [ ] Location preferences

### Phase 4: Automation
- [ ] Deploy Cloud Function for scheduled checks
- [ ] Cron job setup (every 30 minutes)
- [ ] Error monitoring & logging

### Phase 5: React Integration
- [ ] Add VAPID key to frontend
- [ ] Auto-register service worker on app load
- [ ] In-app notification handling
- [ ] Settings page for notification preferences

## Troubleshooting

**Script errors?**
- Check Firebase credentials in `.env`
- Verify `firebase-admin` is installed

**No notification received?**
- Verify FCM token is correct and not expired
- Check browser notification permissions
- Ensure tide time is within next 60 minutes (UTC)
- Check browser console for errors

**Service worker issues?**
- Verify `/public/firebase-messaging-sw.js` exists
- Check DevTools > Application > Service Workers
- Try unregistering and re-registering

## Support & Resources

- [Firebase Cloud Messaging Docs](https://firebase.google.com/docs/cloud-messaging)
- [NOAA Tides API](https://tidesandcurrents.noaa.gov/api/)
- [Service Workers Guide](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

## License

Part of the Shore Connect beach cleanup application.
