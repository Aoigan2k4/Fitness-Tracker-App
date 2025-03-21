// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO:  Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAks1LNzrjkz9qK68IPw_kr4J4lCSNHw9w",
  authDomain: "fir-vite-239f1.firebaseapp.com",
  projectId: "fir-vite-239f1",
  storageBucket: "fir-vite-239f1.firebasestorage.app",
  messagingSenderId: "772428984678",
  appId: "1:772428984678:web:32dcb3f6012c29d75c58a7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); 

export { db };