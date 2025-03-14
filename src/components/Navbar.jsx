import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, InputBase, Avatar, Menu, MenuItem, Button, Box, Divider } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { auth, db } from "../firebase"; // Ensure Firestore (db) is imported
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // State to track admin role

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists() && userSnap.data().role === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
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
      <Box sx={{ backgroundColor: "black", color: "white", textAlign: "center", py: 1 }}>
        <Typography variant="body2">LIMITED-TIME OFFERS! GRAB THE DEALS NOW!</Typography>
      </Box>

      <AppBar position="static" sx={{ backgroundColor: "#eff2f6", padding: "8px 16px", boxShadow: "none" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* Left Side: Logo + Shop Button */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#000", cursor: "pointer" }}
              onClick={() => navigate("/dashboard")}
            >
              unicart
            </Typography>
            <Button
              sx={{
                color: "#000",
                "&:hover": { backgroundColor: "#E5E4E4" },
                "&:focus, &:active": { outline: "none", boxShadow: "none", borderColor: "transparent" },
              }}
              onClick={() => navigate("/shop")}
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
            {isAdmin && (
              <Button
                sx={{
                  marginRight: "16px",
                  color: "white",
                  backgroundColor: "#000000",
                  "&:hover": { backgroundColor: "#e68900" },
                }}
                onClick={() => navigate("/admin")}
              >
                Add Product
              </Button>
            )}

            {user ? (
              <>
                <Avatar
                  sx={{ cursor: "pointer", marginLeft: "16px", bgcolor: "#ff9800", color: "#fff" }}
                  onClick={handleAvatarClick}
                  src={user.photoURL}
                >
                  {user.photoURL ? "" : user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
                </Avatar>

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
                  "&:hover": { borderColor: "#E5E4E4", backgroundColor: "#E5E4E4" },
                  "&:focus, &:active": { outline: "none", boxShadow: "none", borderColor: "#c0c1c0" },
                }}
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
        {/* More Visible Line Break at the Bottom of Navbar */}
        <Divider sx={{ width: "100%", borderBottomWidth: 1, backgroundColor: "#000" }} />
      </AppBar>
    </>
  );
};

export default Navbar;
