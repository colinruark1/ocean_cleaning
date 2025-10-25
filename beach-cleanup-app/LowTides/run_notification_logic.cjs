// --- NEW: Import Firebase Admin ---
const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// --- Load Firebase credentials from root .env file ---
// The .env file in the root directory contains the Firebase service account as JSON
// We'll parse it directly here
const rootEnvPath = path.join(__dirname, '../.env');

// Read the .env file which contains the raw Firebase JSON
const envContent = fs.readFileSync(rootEnvPath, 'utf8');

// Parse the Firebase credentials from the file
// The file contains lines like either:
//   "FIREBASE_PROJECT_ID": "shore-connect" OR
//   "project_id": "shore-connect"
// We'll try both formats
let projectIdMatch = envContent.match(/"FIREBASE_PROJECT_ID":\s*"([^"]+)"/);
let clientEmailMatch = envContent.match(/"FIREBASE_CLIENT_EMAIL":\s*"([^"]+)"/);
let privateKeyMatch = envContent.match(/"FIREBASE_PRIVATE_KEY":\s*"([^"]+)"/);

// Try alternate format if first one didn't work
if (!projectIdMatch) {
  projectIdMatch = envContent.match(/"project_id":\s*"([^"]+)"/);
}
if (!clientEmailMatch) {
  clientEmailMatch = envContent.match(/"client_email":\s*"([^"]+)"/);
}
if (!privateKeyMatch) {
  privateKeyMatch = envContent.match(/"private_key":\s*"([^"]+)"/);
}

if (!projectIdMatch || !clientEmailMatch || !privateKeyMatch) {
  console.error("ERROR: Could not parse Firebase credentials from .env file.");
  console.log("Make sure the root .env file contains the Firebase service account JSON.");
  console.log("Looking for: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY");
  console.log("Or: project_id, client_email, private_key");
  process.exit(1);
}

const serviceAccount = {
  projectId: projectIdMatch[1],
  clientEmail: clientEmailMatch[1],
  privateKey: privateKeyMatch[1].replace(/\\n/g, '\n'), // Convert escaped newlines
};

console.log('[Firebase] Initializing with project:', serviceAccount.projectId);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


// (Your other imports like Twilio would go here if you still used them)
// const db = require('./db'); 

async function checkTidesAndNotify(tideData) {
  console.log(`[Logic] Checking tides for station: ${tideData.station_id}`);
  const now = new Date(); // e.g., 2025-10-25T19:10:00Z (3:10 PM EDT)
  
  const upcomingLowTides = tideData.predictions.filter(p => {
    const tideTime = new Date(p.time); // e.g., 2025-10-25T19:15:00Z
    const minutesUntilTide = (tideTime - now) / 1000 / 60;
    
    // Check for low tides happening in the next 60 minutes
    return p.type === 'Low' && minutesUntilTide > 0 && minutesUntilTide <= 60;
  });

  if (upcomingLowTides.length === 0) {
    console.log(`[Logic] No upcoming low tides found for ${tideData.station_id}.`);
    return;
  }

  // --- MOCK FOR HACKATHON ---
  // Get the token from `fcm_token_getter.html` and paste it here
  const FAKE_TEST_TOKEN = "cKhNWY1xghDj5q40SQnqvn:APA91bHcfouuOh0P5lPNenbLZlLeaBFV0OXppj4Yj6IogUgwW2UMNxTj881CiY2cOsy0o-u6Kp1QFKuy4Asx459PUTIbmkBtUp_PHosPqCDLuyIN7-x7ygo";

  if (FAKE_TEST_TOKEN === "PASTE_YOUR_FCM_TOKEN_FROM_BROWSER_HERE") {
    console.error("STOP! Please paste your FCM token into the FAKE_TEST_TOKEN variable.");
    return;
  }

  const fakeUsers = [
    { name: 'Backend-Dev', fcmToken: FAKE_TEST_TOKEN }
  ];
  // -------------------------
  
  console.log(`[Logic] Found ${fakeUsers.length} user(s) to notify.`);

  for (const tide of upcomingLowTides) {
    const tideTimeLocal = new Date(tide.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const messageBody = `Low tide is approaching at ${tideTimeLocal}. Time to clean!`;
    
    for (const user of fakeUsers) {
      console.log(`[Notify] Sending PUSH NOTIFICATION to ${user.name}`);
      
      // --- NEW: Firebase Push Notification Payload ---
      const message = {
        notification: {
          title: '🌊 Low Tide Alert! 🌊',
          body: messageBody
        },
        data: {
          // You can add any extra data the app needs
          stationId: tideData.station_id,
          tideTime: tide.time,
          type: 'LOW_TIDE_ALERT'
        },
        token: user.fcmToken
      };

      try {
        const response = await admin.messaging().send(message);
        console.log('[Notify] Successfully sent message:', response);
      } catch (error) {
        console.error('[Notify] Error sending message:', error);
      }
    }
  }
}

// 4. Create a "Test" script to run this with your mock file
async function testWithMockData() {
  console.log('[Test] Running with MOCK data...');
  // This just reads your manual file
  const mockData = require('./mock_tides.json');
  await checkTidesAndNotify(mockData);
}

// This lets you run: `node run_notification_logic.js`
testWithMockData();

