import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box, Link } from "@mui/material";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

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
      <Box sx={{ mt: 1 }}>
        {/* Smaller Login Text */}
        <Typography variant="h6" align="center" sx={{ fontWeight: "bold", fontSize: "20px" }}>
          Login
        </Typography>

        <TextField fullWidth label="Email" margin="normal" onChange={(e) => setEmail(e.target.value)} />
        <TextField fullWidth label="Password" type="password" margin="normal" onChange={(e) => setPassword(e.target.value)} />

        {/* Updated Login Button with Hover Effect */}
        <Button
          fullWidth
          variant="contained"
          sx={{
            backgroundColor: "#000",
            color: "#fff",
            mt: 2,
            "&:hover": {
              backgroundColor: "#676667", // Change to gray on hover
            },
            "&:focus, &:active": {
              outline: "none",
              boxShadow: "none", // Remove focus ring
              backgroundColor: "#676667", // Keep hover color when clicked
            },
          }}
          onClick={handleLogin}
        >
          Login
        </Button>

        {/* Divider with OR */}
        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <Box sx={{ flex: 1, height: "1px", bgcolor: "grey.400" }} />
          <Typography sx={{ mx: 1, fontSize: "12px", color: "grey.600" }}>or</Typography>
          <Box sx={{ flex: 1, height: "1px", bgcolor: "grey.400" }} />
        </Box>

        {/* Google Login Button */}
        <Button
          fullWidth
          variant="outlined"
          sx={{
            backgroundColor: "white",
            color: "black",
            mt: 2,
            borderColor: "#c0c1c0", // Default border color
            "&:hover": {
              borderColor: "#E5E4E4",
              backgroundColor: "#E5E4E4",
            },
            "&:focus, &:active": {
              outline: "none",
              boxShadow: "none", // Remove focus ring
              borderColor: "#c0c1c0", // Keep border color unchanged
            },
          }}
          onClick={handleGoogleLogin}
          startIcon={<FcGoogle />}
        >
          Continue with Google
        </Button>

        {/* No account yet? Register */}
        <Typography align="center" sx={{ mt: 2, fontSize: "14px" }}>
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
