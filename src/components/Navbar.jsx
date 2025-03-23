import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  Avatar,
  Menu,
  MenuItem,
  Button,
  Box,
  Divider,
  Modal,
  Fade,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { auth, db } from "../firebase"; // Ensure Firestore (db) is imported
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // State to track admin role
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

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

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
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
            <Box
  sx={{
    display: { xs: "none", sm: "flex" }, // Hide on mobile, show on tablets and larger screens
    alignItems: "center",
    gap: 2,
  }}
>
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

  <Button
    sx={{
      color: "#000",
      "&:hover": { backgroundColor: "#E5E4E4" },
      "&:focus, &:active": { outline: "none", boxShadow: "none", borderColor: "transparent" },
    }}
    onClick={() => navigate("/newarrival")}
  >
    new arrival
  </Button>

  <Button
    sx={{
      color: "#000",
      "&:hover": { backgroundColor: "#E5E4E4" },
      "&:focus, &:active": { outline: "none", boxShadow: "none", borderColor: "transparent" },
    }}
    onClick={() => navigate("/sale")}
  >
    sale
  </Button>
</Box>
          </Box>

          {/* Search Bar */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
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
            {/* Add Product Button (Visible only for Admins on Tablets and Larger Screens) */}
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
              {isAdmin && (
                <Button
                  sx={{
                    marginRight: "16px",
                    color: "white",
                    backgroundColor: "#000000",
                    "&:hover": { backgroundColor: "#e68900" },
                  }}
                  onClick={() => navigate("/admin")} // Navigate to the admin page
                >
                  Add Product
                </Button>
              )}
            </Box>

            <Box sx={{ display: { xs: "flex", sm: "none" } }}>
              <IconButton onClick={toggleModal}>
                <MenuIcon sx={{ color: "#000" }} />
              </IconButton>
            </Box>

            {user ? (
              <>
               <Avatar
                    sx={{
                      display: { xs: "none", sm: "flex" },
                      cursor: "pointer",
                      marginLeft: "16px",
                      bgcolor: "#ff9800",
                      color: "#fff",
                    }}
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

     {/* Mobile Menu Modal */}
<Modal open={isModalOpen} onClose={toggleModal} closeAfterTransition>
  <Fade in={isModalOpen}>
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        bgcolor: "#eff2f6",
        color: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1300,
        padding: "16px",
      }}
    >
      {/* Close Button */}
      <IconButton
        sx={{ position: "absolute", top: "16px", right: "16px", color: "#000" }}
        onClick={toggleModal}
      >
        <CloseIcon />
      </IconButton>

      {/* Navigation Links */}
      <Typography
        variant="h6"
        sx={{
          marginBottom: "16px",
          cursor: "pointer",
          fontWeight: "bold",
          textTransform: "uppercase",
        }}
        onClick={() => {
          navigate("/shop");
          toggleModal();
        }}
      >
        Shop
      </Typography>
      <Typography
        variant="h6"
        sx={{
          marginBottom: "16px",
          cursor: "pointer",
          fontWeight: "bold",
          textTransform: "uppercase",
        }}
        onClick={() => {
          navigate("/newarrival");
          toggleModal();
        }}
      >
        New Arrival
      </Typography>
      <Typography
        variant="h6"
        sx={{
          marginBottom: "16px",
          cursor: "pointer",
          fontWeight: "bold",
          textTransform: "uppercase",
        }}
        onClick={() => {
          navigate("/sale");
          toggleModal();
        }}
      >
        Sale
      </Typography>

{/* Add Product Link (Visible for Admins) */}
{isAdmin && (
  <Typography
    variant="h6"
    sx={{
      marginBottom: "16px",
      cursor: "pointer",
      fontWeight: "bold",
      textTransform: "uppercase",
    }}
    onClick={() => {
      navigate("/admin");
      toggleModal();
    }}
  >
    Add Product
  </Typography>
)}

      {/* Logout or Login */}
      {user ? (
        <Button
          sx={{
            marginTop: "16px",
            color: "black",
            border: "1px solid #c0c1c0",
            "&:hover": { borderColor: "#E5E4E4", backgroundColor: "#E5E4E4" },
          }}
          onClick={() => {
            handleLogout();
            toggleModal();
          }}
        >
          Logout
        </Button>
      ) : (
        <Button
          sx={{
            marginTop: "16px",
            color: "black",
            border: "1px solid #c0c1c0",
            "&:hover": { borderColor: "#E5E4E4", backgroundColor: "#E5E4E4" },
          }}
          onClick={() => {
            navigate("/login");
            toggleModal();
          }}
        >
          Login
        </Button>
      )}
    </Box>
  </Fade>
</Modal>
    </>
  );
};

export default Navbar;