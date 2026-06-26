import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCjF6JgJD0tuaX4vfQc-dgACfRpLADOeYQ",
  authDomain: "styleify-1dc11.firebaseapp.com",
  projectId: "styleify-1dc11",
  storageBucket: "styleify-1dc11.firebasestorage.app",
  messagingSenderId: "1073435001803",
  appId: "1:1073435001803:web:0c5f914a08f34d8589ec4e",
  measurementId: "G-1KC42E7K29"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);