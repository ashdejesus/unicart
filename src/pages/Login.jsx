import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box, Link } from "@mui/material";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 10 }}>
        <Typography variant="h4" align="center" sx={{ fontWeight: "bold" }}>
          Login
        </Typography>
        <TextField fullWidth label="Email" margin="normal" onChange={(e) => setEmail(e.target.value)} />
        <TextField fullWidth label="Password" type="password" margin="normal" onChange={(e) => setPassword(e.target.value)} />
        
        {/* Black Buttons */}
        <Button fullWidth variant="contained" sx={{ backgroundColor: "#000", color: "#fff", mt: 2 }} onClick={handleLogin}>
          Login
        </Button>
        <Button fullWidth variant="contained" sx={{ backgroundColor: "#000", color: "#fff", mt: 2 }} onClick={handleGoogleLogin}>
          Login with Google
        </Button>

        <Typography align="center" sx={{ mt: 2 }}>
          No account yet?{" "}
          <Link component="button" variant="body2" onClick={() => navigate("/signup")}>
            Register
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
