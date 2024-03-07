// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6LjJqrjBrJhl-qYdAaBvg8w34oIoKP90",
  authDomain: "prettan-3ad15.firebaseapp.com",
  projectId: "prettan-3ad15",
  storageBucket: "prettan-3ad15.appspot.com",
  messagingSenderId: "951196276785",
  appId: "1:951196276785:web:5e29ecb5ad5d0a339d9d10"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Authentification

export const auth = getAuth();
