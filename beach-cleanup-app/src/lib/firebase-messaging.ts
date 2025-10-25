// Firebase Cloud Messaging setup for the React app
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyB8WizpujwEMxPpVZCI8MMl1Ubd4kcZB2k",
  authDomain: "shore-connect.firebaseapp.com",
  projectId: "shore-connect",
  storageBucket: "shore-connect.firebasestorage.app",
  messagingSenderId: "511550791613",
  appId: "1:511550791613:web:fb282c8ad7c201c2f37cd4",
  measurementId: "G-VC5VFN9EGC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
let messaging: any = null;
try {
  messaging = getMessaging(app);
} catch (error) {
  console.log('Firebase messaging not supported in this environment:', error);
}

/**
 * Request notification permission and get FCM token
 * IMPORTANT: You must get your VAPID key from Firebase Console:
 * Project Settings > Cloud Messaging > Web Push certificates > Generate key pair
 *
 * Then replace 'YOUR_VAPID_KEY_HERE' below with your actual VAPID key
 */
export async function requestNotificationPermission(): Promise<string | null> {
  if (!messaging) {
    console.log('Messaging not available');
    return null;
  }

  try {
    // Request permission
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      console.log('Notification permission granted.');

      // TODO: Replace this with your VAPID key from Firebase Console
      const VAPID_KEY = 'YOUR_VAPID_KEY_HERE';

      if (VAPID_KEY === 'YOUR_VAPID_KEY_HERE') {
        console.error('⚠️ VAPID key not configured! Get it from Firebase Console > Project Settings > Cloud Messaging');
        return null;
      }

      // Get FCM token
      const token = await getToken(messaging, { vapidKey: VAPID_KEY });

      if (token) {
        console.log('FCM Token:', token);
        console.log('📋 Copy this token to LowTides/run_notification_logic.js');
        return token;
      } else {
        console.log('No registration token available.');
        return null;
      }
    } else {
      console.log('Notification permission denied.');
      return null;
    }
  } catch (error) {
    console.error('An error occurred while retrieving token:', error);
    return null;
  }
}

/**
 * Listen for foreground messages
 */
export function onForegroundMessage(callback: (payload: any) => void) {
  if (!messaging) {
    console.log('Messaging not available');
    return;
  }

  onMessage(messaging, (payload) => {
    console.log('Message received in foreground:', payload);
    callback(payload);
  });
}

/**
 * Register the service worker for background notifications
 */
export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('Service Worker registered successfully:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }
  return null;
}
