// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-analytics.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDGRq9U-3yLHAwq7IEpL8DGeows-tXYs9A",
  authDomain: "inspired-creations-101.firebaseapp.com",
  projectId: "inspired-creations-101",
  storageBucket: "inspired-creations-101.firebasestorage.app",
  messagingSenderId: "504365868774",
  appId: "1:504365868774:web:5b6127847c2f45fdba3d27",
  measurementId: "G-CNFKDGP6VV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Make Firebase available globally
window.firebaseApp = app;