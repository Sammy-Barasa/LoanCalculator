// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJZJVSecrTTHHPOR6axx0s4MplRnXNjCY",
  authDomain: "loaninterestcalculator-47138.firebaseapp.com",
  databaseURL: "https://loaninterestcalculator-47138-default-rtdb.firebaseio.com",
  projectId: "loaninterestcalculator-47138",
  storageBucket: "loaninterestcalculator-47138.appspot.com",
  messagingSenderId: "809479780786",
  appId: "1:809479780786:web:d82d9a3013cdfc041f8cab",
  measurementId: "G-6JPM2VVNMR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const provider = new GoogleAuthProvider();
export const analytics = getAnalytics(app);
export const db = getDatabase(app);