/**
 * Firebase Configuration and Initialization
 * Handles Firebase app initialization and exports services
 */
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// Firebase configuration from environment variables
const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'ocean-cleanup-476302',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'ocean-cleanup-476302.appspot.com',
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
let app;
let storage;

try {
  app = initializeApp(firebaseConfig);
  storage = getStorage(app);
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Error initializing Firebase:', error);
  // Firebase will be null if initialization fails
}

export { app, storage };
