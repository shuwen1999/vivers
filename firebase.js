// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDzzLl70lA2aHMU5adCjCmSmhLJzsfGSh8",
  authDomain: "vivers-c5cce.firebaseapp.com",
  projectId: "vivers-c5cce",
  storageBucket: "vivers-c5cce.appspot.com",
  messagingSenderId: "476033425092",
  appId: "1:476033425092:web:961f56eb6736121ad4f391"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore()

export {auth, db};