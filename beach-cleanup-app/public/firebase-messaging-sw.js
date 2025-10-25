// Firebase Cloud Messaging Service Worker
// This file handles background notifications when the app is not in focus

importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Initialize Firebase in the service worker
const firebaseConfig = {
  apiKey: "AIzaSyB8WizpujwEMxPpVZCI8MMl1Ubd4kcZB2k",
  authDomain: "shore-connect.firebaseapp.com",
  projectId: "shore-connect",
  storageBucket: "shore-connect.firebasestorage.app",
  messagingSenderId: "511550791613",
  appId: "1:511550791613:web:fb282c8ad7c201c2f37cd4",
  measurementId: "G-VC5VFN9EGC"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification.title || 'Low Tide Alert';
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: payload.data
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});
