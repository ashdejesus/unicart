import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box, Link } from "@mui/material";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "../firebase";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user details to Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
      });

      navigate("/dashboard"); // Redirect to dashboard after signup
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(
        doc(db, "users", user.uid),
        {
          name: user.displayName || "",
          email: user.email,
        },
        { merge: true }
      );

      navigate("/dashboard"); // Redirect to dashboard after Google signup
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 10 }}>
        <Typography variant="h4" align="center" sx={{ fontWeight: "bold" }}>
          Sign Up
        </Typography>
        <TextField fullWidth label="Name" margin="normal" onChange={(e) => setName(e.target.value)} />
        <TextField fullWidth label="Email" margin="normal" onChange={(e) => setEmail(e.target.value)} />
        <TextField fullWidth label="Password" type="password" margin="normal" onChange={(e) => setPassword(e.target.value)} />

        {/* Black Buttons */}
        <Button fullWidth variant="contained" sx={{ backgroundColor: "#000", color: "#fff", mt: 2 }} onClick={handleSignup}>
          Sign Up with Email
        </Button>
        <Button fullWidth variant="contained" sx={{ backgroundColor: "#000", color: "#fff", mt: 2 }} onClick={handleGoogleSignup}>
          Sign Up with Google
        </Button>

        {/* Already have an account? Login */}
        <Typography align="center" sx={{ mt: 2 }}>
          Already have an account?{" "}
          <Link component="button" variant="body2" onClick={() => navigate("/login")}>
            Login
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Signup;
