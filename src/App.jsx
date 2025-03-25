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
import ProductPage from "./pages/ProductPage"; // Import ProductPage
import { auth, onAuthStateChanged, checkAdmin } from "./firebase";
import Chatbot from "./components/Chatbot";
import ScrollToTop from "./components/ScrollToTop"; // Adjust the path as needed
import Cart from "./pages/Cart"; // Import Cart


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
    return (
      <Box
        sx={{
          height: "100vh",
          width: "100vw", // Ensure it spans the full width of the viewport
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#eff2f6", // Match the background color
        }}
      >
        Loading...
      </Box>
    );
  }
  
  return (
    <>
      <CssBaseline />
      <Router>
        <ScrollToTop /> {/* Add this component */}
        <Navbar />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            width: "100vw", // Ensure it spans the full width of the viewport
            overflowX: "hidden",
            backgroundColor: "#eff2f6", // Match the background color
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              width: "100%",
              padding: 0,
              margin: 0,
              backgroundColor: "#eff2f6", // Match the background color
            }}
          >
            <Routes>
              <Route path="/shop" element={<Shop />} />
              <Route path="/cart" element={<Cart />} /> {/* Added Cart route */}
              <Route path="/product/:id" element={<ProductPage />} /> {/* Added ProductPage route */}
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
      <Chatbot />
    </>
  );
}

export default App;