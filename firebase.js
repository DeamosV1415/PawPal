// src/services/firebase.js

// Import the necessary Firebase packages
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
// Replace these values with your actual Firebase project details
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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Authentication functions
export const registerUser = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update the user's profile with their name
    await updateProfile(user, {
      displayName: name
    });
    
    return { user };
  } catch (error) {
    return { error };
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user };
  } catch (error) {
    return { error };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { error };
  }
};

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return { error };
  }
};

// Observer for auth state changes
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Access the current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

export { auth, db };
