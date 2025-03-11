import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, Box } from "@mui/material";
import Navbar from "./components/Navbar";
import Shop from "./pages/Shop";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Footer from "./components/Footer";
import AdminPanel from "./pages/AdminPanel";
import { auth, onAuthStateChanged, checkAdmin } from "./firebase";

function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const adminStatus = await checkAdmin(user.uid);
        setIsAdmin(adminStatus);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });
  }, []);

  return (
    <>
      <CssBaseline />
      <Router>
        <Navbar />
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", width: "100vw", overflowX: "hidden" }}>
          <Box sx={{ flexGrow: 1, width: "100%", padding: 0, margin: 0 }}>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/admin" element={user && isAdmin ? <AdminPanel /> : <Navigate to="/admin" />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </Router>
    </>
  );
}

export default App;
