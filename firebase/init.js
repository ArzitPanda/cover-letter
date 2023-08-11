// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { GoogleAuthProvider } from "firebase/auth";


import { getFirestore } from "firebase/firestore";



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADQJ73XoeE8qSU83evm9GpXUPhM2vOBAs",
  authDomain: "cover-letter-b3580.firebaseapp.com",
  projectId: "cover-letter-b3580",
  storageBucket: "cover-letter-b3580.appspot.com",
  messagingSenderId: "337388245221",
  appId: "1:337388245221:web:47d971e72929791aee840c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export  const provider = new GoogleAuthProvider(app);

