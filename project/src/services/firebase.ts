import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// In a real app, these would be in environment variables
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "workforce-pwa.firebaseapp.com",
  projectId: "workforce-pwa",
  storageBucket: "workforce-pwa.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

export default app;