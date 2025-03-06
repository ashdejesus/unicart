import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDZj8TfoWIT_2JuLml2G72Dn8I9x6wx92I",
    authDomain: "unicart-12d87.firebaseapp.com",
    projectId: "unicart-12d87",
    storageBucket: "unicart-12d87.appspot.com", // FIXED
    messagingSenderId: "676696113963",
    appId: "1:676696113963:web:6d384b8564667043287b6e",
    measurementId: "G-70CYNPSM0P"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider(); // ADD THIS
export const db = getFirestore(app);
