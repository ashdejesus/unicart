import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box, Link, Divider } from "@mui/material";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "../firebase";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

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

      navigate("/dashboard"); // Redirect after signup
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

      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 1, textAlign: "center" }}>
        <Typography variant="h6" fontWeight="bold" fontSize="20px">
          Sign Up
        </Typography>

        <TextField fullWidth label="Name" margin="normal" sx={{ mt: 2 }} onChange={(e) => setName(e.target.value)} />
        <TextField fullWidth label="Email" margin="normal" sx={{ mt: 2 }} onChange={(e) => setEmail(e.target.value)} />
        <TextField fullWidth label="Password" type="password" margin="normal" sx={{ mt: 2 }} onChange={(e) => setPassword(e.target.value)} />

        <Button fullWidth variant="contained" sx={{ backgroundColor: "#000", color: "#fff", mt: 2 }} onClick={handleSignup}>
          Sign Up with Email
        </Button>

        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <Box sx={{ flex: 1, height: "1px", bgcolor: "grey.400" }} />
          <Typography sx={{ mx: 1, fontSize: "12px", color: "grey.600" }}>or</Typography>
          <Box sx={{ flex: 1, height: "1px", bgcolor: "grey.400" }} />
        </Box>

        <Button
          fullWidth
          variant="outlined"
          sx={{
            backgroundColor: "white",
            color: "black",
            mt: 2,
            borderColor: "black", // Outline color set to black
            "&:hover": {
              borderColor: "black", // Keep outline black on hover
              backgroundColor: "#E5E4E4", // Hover background color
            },
          }}
          onClick={handleGoogleSignup}
          startIcon={<FcGoogle />}
        >
          Continue with Google
        </Button>

        <Typography sx={{ mt: 2, fontSize: "14px" }}>
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
