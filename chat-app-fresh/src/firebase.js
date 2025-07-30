// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// auth import -> step-1
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// firstore step-1
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCzbC61QvvWWZYJ0UPP4DOBWcN-GafYC84",
    authDomain: "wa-clone-6b0d7.firebaseapp.com",
    projectId: "wa-clone-6b0d7",
    storageBucket: "wa-clone-6b0d7.firebasestorage.app",
    messagingSenderId: "1060425994068",
    appId: "1:1060425994068:web:82dca60df1977a48d242c1"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// auth-step-2
const auth = getAuth(app);
// firestor step-2
const db = getFirestore();
const storage = getStorage();

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();

export { auth, db, storage, googleProvider }

