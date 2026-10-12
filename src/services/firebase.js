import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Firebase configuration from environment or fallback template
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForEquipTraceDemo123456",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "equiptrace-system.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "equiptrace-system",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "equiptrace-system.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "103948572910",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:103948572910:web:abcdef1234567890"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Messaging initialized safely for supported browser environments
let messaging = null;
try {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    messaging = getMessaging(app);
  }
} catch (error) {
  console.warn("FCM Messaging initialization note:", error.message);
}

export { 
  messaging,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  getToken,
  onMessage
};

export default app;
