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
import LocalMallTwoToneIcon from "@mui/icons-material/LocalMallTwoTone";
import MenuOpenTwoToneIcon from "@mui/icons-material/MenuOpenTwoTone";
import { collection, getDocs, setDoc, deleteDoc } from "firebase/firestore"; // Import Firestore methods

const Navbar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // State to track admin role
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]); // State to store cart items

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

  

  const updateCartItemQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return; // Prevent quantity from going below 1
  
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("❌ User not authenticated");
        return;
      }
  
      const cartRef = collection(db, "users", user.uid, "carts");
      const itemRef = doc(cartRef, itemId);
  
      await setDoc(
        itemRef,
        { quantity: newQuantity },
        { merge: true } // Merge to update only the quantity field
      );
  
      // Update the cartItems state to reflect the new quantity
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
  
      console.log("✅ Cart item quantity updated!");
    } catch (error) {
      console.error("❌ Error updating cart item quantity:", error);
    }
  };

  const removeCartItem = async (itemId) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("❌ User not authenticated");
        return;
      }
  
      const cartRef = collection(db, "users", user.uid, "carts");
      const itemRef = doc(cartRef, itemId);
  
      // Delete the item from Firestore
      await deleteDoc(itemRef);
  
      // Update the cartItems state to remove the item
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  
      console.log("✅ Cart item removed!");
    } catch (error) {
      console.error("❌ Error removing cart item:", error);
    }
  };
  const toggleCartSidebar = async () => {
    setIsCartOpen((prev) => !prev);
  
    if (!isCartOpen && user) {
      try {
        // Fetch cart items from Firestore: "users/{userId}/carts"
        const cartRef = collection(db, "users", user.uid, "carts");
        const querySnapshot = await getDocs(cartRef);
  
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        setCartItems(items);
        console.log("🛒 Cart items fetched:", items);
      } catch (error) {
        console.error("❌ Error fetching cart items:", error);
      }
    }
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
  <MenuOpenTwoToneIcon sx={{ color: "#000" }} />
</IconButton>
            </Box>




            <Button
  sx={{
    fontSize: "25px",
    marginLeft: "16px",
    color: "black",
    "&:hover": { borderColor: "#E5E4E4", backgroundColor: "#E5E4E4" },
    "&:focus, &:active": { outline: "none", boxShadow: "none", borderColor: "#c0c1c0" },
  }}
  onClick={toggleCartSidebar} // Added onClick event to open sidebar
>
  <LocalMallTwoToneIcon />
</Button>





              {/* Cart Sidebar */}
<Modal open={isCartOpen} onClose={toggleCartSidebar} closeAfterTransition>
  <Fade in={isCartOpen}>
    <Box
      sx={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "400px", // Increased width for better layout
        height: "100vh",
        bgcolor: "white",
        boxShadow: "-5px 0px 10px rgba(0, 0, 0, 0.2)",
        display: "flex",
        flexDirection: "column",
        zIndex: 1400,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px",
          borderBottom: "1px solid #ddd",
          backgroundColor: "#f8f8f8",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Shopping Cart
        </Typography>
        <IconButton onClick={toggleCartSidebar}>
          <CloseIcon />
        </IconButton>
      </Box>

     {/* Cart Items */}
<Box sx={{ flex: 1, padding: "16px", overflowY: "auto" }}>
  {cartItems.length > 0 ? (
    cartItems.map((item) => (
      <Box
        key={item.id}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
          paddingBottom: "16px",
          borderBottom: "1px solid #eee",
        }}
      >
        {/* Product Image */}
        <Box
          component="img"
          src={item.image || "https://via.placeholder.com/50"}
          alt={item.name}
          sx={{
            width: "50px",
            height: "50px",
            borderRadius: "8px",
            objectFit: "cover",
            marginRight: "16px",
          }}
        />
        {/* Product Details */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            {item.name}
          </Typography>
          <Typography variant="body2" sx={{ color: "#666" }}>
            Size: {item.size}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginTop: "8px" }}>
            <Button
              variant="outlined"
              size="small"
              sx={{
                minWidth: "30px",
                padding: "4px",
                borderColor: "#ddd",
                color: "#333",
                "&:hover": { borderColor: "#333" },
              }}
              onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1} // Disable if quantity is 1
            >
              -
            </Button>
            <Typography variant="body2" sx={{ fontWeight: "bold", color: "#333" }}>
              {item.quantity}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              sx={{
                minWidth: "30px",
                padding: "4px",
                borderColor: "#ddd",
                color: "#333",
                "&:hover": { borderColor: "#333" },
              }}
              onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
            >
              +
            </Button>
          </Box>
        </Box>
        {/* Price and Remove Button */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <Typography variant="body2" sx={{ fontWeight: "bold", color: "#333", marginBottom: "8px" }}>
          ₱{item.price * item.quantity}
          </Typography>
          <Button
            variant="text"
            size="small"
            sx={{
              color: "red",
              "&:hover": { textDecoration: "underline" },
            }}
            onClick={() => removeCartItem(item.id)}
          >
            Remove
          </Button>
        </Box>
      </Box>
    ))
  ) : (
    <Typography variant="body1" sx={{ textAlign: "center", color: "#666" }}>
      Your cart is empty.
    </Typography>
  )}
</Box>

      {/* Subtotal Section */}
      {cartItems.length > 0 && (
        <Box
          sx={{
            padding: "16px",
            borderTop: "1px solid #ddd",
            backgroundColor: "#f8f8f8",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Subtotal:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "bold", color: "#333" }}>
            ₱{cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
            </Typography>
          </Box>
          <Button
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: "#000",
              color: "white",
              "&:hover": { backgroundColor: "#333" },
            }}
            onClick={() => navigate("/cart")}
          >
            Go to Cart
          </Button>
        </Box>
      )}
    </Box>
  </Fade>
</Modal>



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