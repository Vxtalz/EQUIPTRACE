import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendPasswordResetEmail,
  updateProfile,
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
  setDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDRBbSAjN429QMjsSOc11eIXD9iTczYa-g",
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "equiptrace-41dc4.firebaseapp.com",
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID || "equiptrace-41dc4",
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "equiptrace-41dc4.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "342107433590",
  appId:             import.meta.env.VITE_FIREBASE_APP_ID || "1:342107433590:web:1e07878e39e206e9edcd57",
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-RWTNM2S3N8",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db   = getFirestore(app);

let messaging = null;
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  isSupported().then((supported) => {
    if (supported) {
      messaging = getMessaging(app);
    }
  }).catch(() => {});
}

export {
  messaging,
  // Auth helpers
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendPasswordResetEmail,
  updateProfile,
  // Firestore helpers
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  // FCM helpers
  getToken,
  onMessage,
};

export default app;
