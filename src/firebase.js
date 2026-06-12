// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAunBtuCNJagSqlrcCF2hxdsKuiwg3p0VU",
  authDomain: "mercadinho-estoque-6391b.firebaseapp.com",
  projectId: "mercadinho-estoque-6391b",
  storageBucket: "mercadinho-estoque-6391b.firebasestorage.app",
  messagingSenderId: "914706797765",
  appId: "1:914706797765:web:2d4a9f61e96f609c600cac",
  measurementId: "G-5S7JHM9M6S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app)
const auth = getAuth(app)

export { db, auth }