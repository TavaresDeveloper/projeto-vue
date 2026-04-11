// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCDV3SVkS4EKVz4sEXonUsT0WZGqO87FHo",
  authDomain: "controle-de-estoque-69e9d.firebaseapp.com",
  projectId: "controle-de-estoque-69e9d",
  storageBucket: "controle-de-estoque-69e9d.firebasestorage.app",
  messagingSenderId: "183765733201",
  appId: "1:183765733201:web:03c356bfe2c7904e1a4d70",
  measurementId: "G-EP61GFH96H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };