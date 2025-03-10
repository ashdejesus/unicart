import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline, Box } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Navbar from "./components/Navbar";
import Shop from "./pages/Shop";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Footer from "./components/Footer";

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        {/* Ensure full-width & no extra padding */}
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", width: "100vw", overflowX: "hidden" }}>
          <Box sx={{ flexGrow: 1, width: "100%", padding: 0, margin: 0 }}>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
            <Footer /> {/* Footer is now globally included */}
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
