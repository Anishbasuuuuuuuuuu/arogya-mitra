// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// ▼▼▼ CRUCIAL: PASTE YOUR FIREBASE CONFIG CODE HERE ▼▼▼
const firebaseConfig = {
  apiKey: "AIzaSyCN0hG-TNOMtZ92JTlGcA9LyAQI9UZK_1E",
  authDomain: "arogya-mitra-34610.firebaseapp.com",
  projectId: "arogya-mitra-34610",
  storageBucket: "arogya-mitra-34610.firebasestorage.app",
  messagingSenderId: "163520534202",
  appId: "1:163520534202:web:5dadefadfae24d294ed483",
  measurementId: "G-0H03FWDJBJ"
};
// ▲▲▲ END OF FIREBASE CONFIG ▲▲▲

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);