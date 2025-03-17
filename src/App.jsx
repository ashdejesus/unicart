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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const adminStatus = await checkAdmin(user.uid);
        setIsAdmin(adminStatus);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false); // Stop loading when authentication is checked
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  if (loading) {
    return <Box sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>Loading...</Box>;
  }

  return (
    <>
      <CssBaseline />
      <Router>
        <Navbar />
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", width: "100vw", overflowX: "hidden" }}>
          <Box sx={{ flexGrow: 1, width: "100%", padding: 0, margin: 0 }}>
            <Routes>
              <Route path="/shop" element={<Shop />} />
              <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
              <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/admin" element={user && isAdmin ? <AdminPanel /> : <Navigate to="/login" />} />
              <Route path="*" element={<Navigate to="/shop" />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </Router>
    </>
  );
}

export default App;
