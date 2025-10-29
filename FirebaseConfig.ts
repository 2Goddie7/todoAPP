// FirebaseConfig.ts - CORREGIDO para React Native
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAVSrH3ZpFpil30s1HS4DxNJUo-WjKX5BM",
  authDomain: "todoapp-11705.firebaseapp.com",
  projectId: "todoapp-11705",
  storageBucket: "todoapp-11705.firebasestorage.app",
  messagingSenderId: "133326766457",
  appId: "1:133326766457:web:fb7178f882f75ca1bc6fa8",
  measurementId: "G-THDMCRLWLR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const db = getFirestore(app);
