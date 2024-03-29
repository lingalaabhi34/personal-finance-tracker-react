// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth,GoogleAuthProvider} from "firebase/auth";
import {getFirestore,doc,setDoc} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBq06wgOcci7SrXF_Ko8KwQxhdENCKsb58",
  authDomain: "personal-finance-tracker-939b6.firebaseapp.com",
  projectId: "personal-finance-tracker-939b6",
  storageBucket: "personal-finance-tracker-939b6.appspot.com",
  messagingSenderId: "319000898018",
  appId: "1:319000898018:web:1b097b81d0be6fabadf1bb",
  measurementId: "G-9QF1VYBRLN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export {db,auth,provider,doc,setDoc};