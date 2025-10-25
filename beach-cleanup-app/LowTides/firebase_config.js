// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);