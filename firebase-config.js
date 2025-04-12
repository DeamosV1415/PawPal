// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-NyRtoDYXbbXTln75p3PQxovTCP5mgWA",
  authDomain: "pet-care-app-51173.firebaseapp.com",
  projectId: "pet-care-app-51173",
  storageBucket: "pet-care-app-51173.firebasestorage.app",
  messagingSenderId: "752985874438",
  appId: "1:752985874438:web:6c1eaaac4009588d7c2387",
  measurementId: "G-J76YN4HL1C"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
