import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, InputBase, Avatar, Menu, MenuItem, Button, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { auth } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
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
    setAnchorEl(null);
    navigate("/login");
  };

  return (
    <>
      {/* Promotional Banner */}
      <Box sx={{ backgroundColor: "#000", color: "#fff", textAlign: "center", py: 1 }}>
        <Typography variant="body2">🔥 Limited-time offers! Grab the best deals now! 🔥</Typography>
      </Box>

      <AppBar position="static" sx={{ backgroundColor: "#fff", padding: "8px 16px", boxShadow: "none" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* Left Side: Logo + Shop Button */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#000", cursor: "pointer" }}
            >
              unicart
            </Typography>
            <Button
              sx={{
                color: "#000",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#E5E4E4" },
                "&:focus, &:active": { outline: "none", boxShadow: "none", borderColor: "transparent" },
              }}
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

          {/* Right Side: Avatar / Login */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {user ? (
              <>
                <Avatar
                  sx={{ cursor: "pointer", marginLeft: "16px", bgcolor: "#ff9800", color: "#fff" }}
                  onClick={handleAvatarClick}
                >
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
                </Avatar>
                
                {/* Fix: Correctly anchor the logout menu */}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                sx={{
                  marginLeft: "16px",
                  color: "black",
                  border: "1px solid #c0c1c0",
                  "&:hover": {
                    borderColor: "#E5E4E4",
                    backgroundColor: "#E5E4E4",
                  },
                  "&:focus, &:active": {
                    outline: "none",
                    boxShadow: "none",
                    borderColor: "#c0c1c0",
                  },
                }}
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
