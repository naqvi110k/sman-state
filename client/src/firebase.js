// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "sman-state.firebaseapp.com",
  projectId: "sman-state",
  storageBucket: "sman-state.firebasestorage.app",
  messagingSenderId: "73737967111",
  appId: "1:73737967111:web:417ff3c852baad05e83ca2"
};




// Initialize Firebase
export const app = initializeApp(firebaseConfig);