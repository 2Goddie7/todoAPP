// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
export const db = getAnalytics(app);