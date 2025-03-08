import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, InputBase, Avatar, Menu, MenuItem, Button, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { auth } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };


  return (
    <>
      {/* Promotional Banner */}
      <Box sx={{ backgroundColor: "#000", color: "#fff", textAlign: "center", py: 1 }}>
        <Typography variant="body2">🔥 Limited-time offers! Grab the best deals now! 🔥</Typography>
      </Box>

      <AppBar position="static" sx={{ backgroundColor: "#fff", padding: "8px 16px", boxShadow: "none" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Left Side: Logo + Shop/Home Toggle */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#000", cursor: "pointer", mr: 2 }}
            >
              unicart
            </Typography>
            <Button
              sx={{ color: "#000", fontWeight: "bold" }}
              onClick={() => navigate("/Shop")}
            >
              shop
            </Button>
          </Box>

          {/* Search Bar */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#f1f1f1",
              borderRadius: "5px",
              padding: "4px 10px",
              width: "50%",
            }}
          >
            <SearchIcon sx={{ color: "#000" }} />
            <InputBase placeholder="Search products..." sx={{ marginLeft: "8px", flex: 1, color: "#000" }} />
          </Box>

          {/* Right Side: Dashboard + Avatar / Login */}
          <Box sx={{ display: "flex", alignItems: "center" }}>

            {user ? (
              <>
                <Avatar
                  sx={{ cursor: "pointer", marginLeft: "16px", bgcolor: "#ff9800", color: "#fff" }}
                  onClick={handleAvatarClick}
                >
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
                </Avatar>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                sx={{ marginLeft: "16px", color: "#000", border: "1px solid #000" }}
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
