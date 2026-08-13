// Firebase SDK Imports

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Firebase Configuration

const firebaseConfig = {
    apiKey: "AIzaSyC-dGn8MjLA64dv6dvlSkgP-u9v34PbFVQ",
    authDomain: "christ-convent-hrms.firebaseapp.com",
    projectId: "christ-convent-hrms",
    storageBucket: "christ-convent-hrms.firebasestorage.app",
    messagingSenderId: "154549432687",
    appId: "1:154549432687:web:a3b5b9942ae6721b9af89a"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

// Authentication

const auth = getAuth(app);

// Firestore Database
// IMPORTANT
// If your database name is cce-hrms use this

const db = getFirestore(app, "cce-hrms");

// Export

export { auth, db };