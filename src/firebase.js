import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDZj8TfoWIT_2JuLml2G72Dn8I9x6wx92I",
  authDomain: "unicart-12d87.firebaseapp.com",
  projectId: "unicart-12d87",
  storageBucket: "unicart-12d87.appspot.com",
  messagingSenderId: "676696113963",
  appId: "1:676696113963:web:6d384b8564667043287b6e",
  measurementId: "G-70CYNPSM0P",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// ✅ Save user to Firestore on login (ensures role is always set)
const saveUserToFirestore = async (user) => {
  if (!user) return;

  try {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    // ✅ Always update the role if it's missing
    if (!userSnap.exists() || !userSnap.data().role) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        role: userSnap.exists() ? userSnap.data().role || "user" : "user",
      }, { merge: true });

      console.log("User saved/updated in Firestore!");
    }
  } catch (error) {
    console.error("Error saving user:", error);
  }
};

// ✅ Automatically store user when logged in
onAuthStateChanged(auth, async (user) => {
  if (user) {
    await saveUserToFirestore(user);
  }
});

// ✅ Check if user is an admin (use inside components, not in firebase.js)
const checkAdmin = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() && userSnap.data().role === "admin";
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

// ✅ Make user an admin manually
const makeUserAdmin = async (uid) => {
  try {
    await setDoc(doc(db, "users", uid), { role: "admin" }, { merge: true });
    console.log("User promoted to admin.");
  } catch (error) {
    console.error("Error setting admin role:", error);
  }
};

export { auth, provider, db, checkAdmin, makeUserAdmin, onAuthStateChanged };
