import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAWZ4_51zoIK74BHQezq8QdXaw-Pw3L7Qk",
    authDomain: "escala-nt.firebaseapp.com",
    projectId: "escala-nt",
    storageBucket: "escala-nt.firebasestorage.app",
    messagingSenderId: "434924380196",
    appId: "1:434924380196:web:79ee304e11d5c3a3a5f8b1",
    measurementId: "G-Q4PC60VJH9"
  };

  const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);   
    const auth = getAuth(firebaseApp);

export { db, auth };