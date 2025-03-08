import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline, Container, Box } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Navbar from "./components/Navbar";
import Shop from "./pages/Shop";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";


const theme = createTheme();


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", width: "100vw" }}>
          <Container maxWidth={false} sx={{ flexGrow: 1 }}>
            <Routes>
            <Route path="/" element={<Dashboard />} />  
              <Route path="/shop" element={<Shop />} />  
             
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}


export default App;