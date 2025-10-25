# Low Tide Notifications - Testing Guide

This guide will help you test the Low Tide notification system using mock data.

## Prerequisites

- Node.js installed
- Firebase project "shore-connect" set up
- Chrome or Firefox browser (for better push notification support)

## Setup Steps

### Step 1: Get Your VAPID Key from Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your **shore-connect** project
3. Click the gear icon ⚙️ > **Project Settings**
4. Go to the **Cloud Messaging** tab
5. Scroll down to **Web Push certificates**
6. Click **Generate key pair** (if you haven't already)
7. Copy the VAPID key (starts with `B...`)

Keep this key handy - you'll need it in the next step!

### Step 2: Generate Your FCM Token

1. Open `LowTides/fcm_token_getter.html` in your browser:
   ```bash
   # Option 1: Open directly in browser
   open LowTides/fcm_token_getter.html

   # Option 2: Use a local server (recommended)
   cd LowTides
   python3 -m http.server 8000
   # Then visit: http://localhost:8000/fcm_token_getter.html
   ```

2. On the page:
   - Paste your VAPID key (from Step 1) into the input field
   - Click **"Get My FCM Token"**
   - Click **"Allow"** when your browser asks for notification permission
   - Your FCM token will appear in the text area
   - Click **"Copy Token to Clipboard"**

### Step 3: Configure the Notification Script

1. Open `LowTides/run_notification_logic.cjs`
2. Find line 54 where it says:
   ```javascript
   const FAKE_TEST_TOKEN = "PASTE_YOUR_FCM_TOKEN_FROM_BROWSER_HERE";
   ```
3. Replace the placeholder with your actual FCM token:
   ```javascript
   const FAKE_TEST_TOKEN = "eXaMpLe...your-actual-token-here...";
   ```
4. Save the file

### Step 4: Verify Dependencies

The necessary dependencies should already be installed. You can verify:

```bash
npm list firebase-admin
# Should show: firebase-admin@13.5.0
```

If not installed, run:
```bash
npm install firebase-admin
```

### Step 5: Update Mock Tide Times (Optional)

The mock data in `mock_tides.json` needs to have a low tide within the next 60 minutes for the notification to trigger.

**Current mock data:**
```json
{
  "station_id": "8518750",
  "predictions": [
    {
      "type": "Low",
      "time": "2025-10-25T14:15:00Z"
    }
  ]
}
```

**To test immediately**, update the time to be within the next hour:

1. Open `mock_tides.json`
2. Change the `time` field to current time + 30 minutes in UTC format
3. Example: If it's currently 3:00 PM UTC, set it to `2025-10-25T15:30:00Z`

**Quick way to get current UTC time:**
```javascript
// Run in browser console or Node:
new Date().toISOString()  // Example: "2025-10-25T15:30:45.123Z"
```

### Step 6: Run the Notification Script

```bash
node LowTides/run_notification_logic.cjs
```

Or from the LowTides directory:
```bash
cd LowTides
node run_notification_logic.cjs
```

**Expected output:**
```
[Firebase] Initializing with project: shore-connect
[Test] Running with MOCK data...
[Logic] Checking tides for station: 8518750
[Logic] Found 1 user(s) to notify.
[Notify] Sending PUSH NOTIFICATION to Backend-Dev
[Notify] Successfully sent message: projects/shore-connect/messages/0:1234567890
```

### Step 7: Check Your Notification

You should receive a push notification that says:
```
🌊 Low Tide Alert! 🌊
Low tide is approaching at [time]. Time to clean!
```

**Where to see it:**
- **Browser is open**: Notification appears in the top-right corner
- **Browser is closed**: Check your OS notification center
- **If using the HTML page**: It will also show an alert dialog

## Troubleshooting

### No notification received?

1. **Check browser permissions:**
   - Make sure you allowed notifications for the page
   - Chrome: Settings > Privacy and Security > Site Settings > Notifications

2. **Check the console output:**
   - Look for error messages when running `node run_notification_logic.js`
   - Common errors:
     - `"Invalid registration token"` = Wrong FCM token
     - `"Error: No matching credentials found"` = Environment variables not set

3. **Verify the mock time:**
   - The low tide must be within the next 60 minutes
   - Make sure you're using UTC time, not local time

4. **Check service worker:**
   - Open browser DevTools (F12)
   - Go to Application > Service Workers
   - Verify `firebase-messaging-sw.js` is registered

### Script exits with "Missing Firebase environment variables"?

The script expects the root `.env` file to contain Firebase credentials in JSON format. Verify that `/Users/colinjacobruark/shore-connect-app/.env` contains the Firebase service account JSON with fields like:
- `"project_id": "shore-connect"`
- `"client_email": "..."`
- `"private_key": "..."`

### Browser console errors?

**Error: "messaging/unsupported-browser"**
- Solution: Use Chrome, Firefox, or Edge (Safari has limited support)

**Error: "messaging/permission-blocked"**
- Solution: Reset site permissions and try again

**Error: "messaging/token-subscribe-failed"**
- Solution: Check that your VAPID key is correct

## Testing Different Scenarios

### Test 1: Immediate notification (within 30 minutes)
```json
{
  "type": "Low",
  "time": "2025-10-25T[CURRENT_TIME+30min]Z"
}
```

### Test 2: No notification (low tide too far away)
```json
{
  "type": "Low",
  "time": "2025-10-25T[CURRENT_TIME+2hours]Z"
}
```

### Test 3: Multiple low tides
```json
{
  "predictions": [
    {
      "type": "Low",
      "time": "2025-10-25T[CURRENT_TIME+15min]Z"
    },
    {
      "type": "Low",
      "time": "2025-10-25T[CURRENT_TIME+45min]Z"
    }
  ]
}
```

## Next Steps for Production

This is a testing setup. For production, you'll need to:

1. **Integrate a real tide API** (NOAA, XTide, etc.)
2. **Set up a database** to store user FCM tokens and preferences
3. **Create a scheduled job** (cron, Cloud Functions) to run checks automatically
4. **Add user management** to allow multiple users to subscribe/unsubscribe
5. **Implement location selection** so users can choose their beach
6. **Add error handling and logging** for monitoring

## Files Reference

- `run_notification_logic.cjs` - Backend script that sends notifications
- `fcm_token_getter.html` - Web page to get your FCM token
- `mock_tides.json` - Test tide data
- `firebase-messaging-sw.js` - Service worker (in `/public` folder)
- `src/lib/firebase-messaging.ts` - React app Firebase setup (for future integration)

## Support

If you run into issues, check:
1. Firebase Console > Cloud Messaging for any quota or error messages
2. Browser console (F12) for JavaScript errors
3. Node.js console output for backend errors
