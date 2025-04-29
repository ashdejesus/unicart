import React, { useEffect, useState } from "react";
import { Box, Typography, Button, TextField, Divider, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebase"; // Import Firebase instance
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate(); // Initialize navigate

  // Fetch cart items from Firebase
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.error("❌ User not authenticated");
          return;
        }

        const cartRef = collection(db, "users", user.uid, "carts");
        const querySnapshot = await getDocs(cartRef);

        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCartItems(items);
      } catch (error) {
        console.error("❌ Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, []);

  // Remove item from cart
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

  return (
    <Box sx={{ maxWidth: "1200px", margin: "auto", padding: "20px" }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
        your cart
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Not ready to checkout? Continue Shopping
      </Typography>

      <Box sx={{ display: "flex", gap: 4 }}>
        {/* Cart Items */}
        <Box sx={{ flex: 2 }}>
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <Box key={item.id} sx={{ display: "flex", borderBottom: "1px solid #ddd", padding: 2 }}>
                <Box
                  component="img"
                  src={item.image || "https://via.placeholder.com/80"}
                  alt={item.name}
                  sx={{ width: "80px", height: "80px", borderRadius: "8px", objectFit: "cover", mr: 2 }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6">{item.name}</Typography>
                  <Typography variant="body2">Size: {item.size}</Typography>
                  <Typography variant="body2">Quantity: {item.quantity}</Typography>
                  <Typography variant="body2">by {item.vendor || "Unknown Vendor"}</Typography>
                  <Typography variant="h6" sx={{ mt: 1 }}>₱{item.price * item.quantity}</Typography>
                </Box>
                <IconButton onClick={() => removeCartItem(item.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))
          ) : (
            <Typography variant="body1" sx={{ textAlign: "center", color: "#666" }}>
              Your cart is empty.
            </Typography>
          )}
        </Box>

        {/* Order Summary */}
        <Box sx={{ flex: 1, bgcolor: "#eff2f6", padding: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Order Summary
          </Typography>
          <TextField fullWidth placeholder="Enter coupon code here" variant="outlined" size="small" sx={{ mb: 2 }} />
          <Typography variant="body1">
            Subtotal: ₱
            {cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}
          </Typography>
          <Typography variant="body1">Shipping: Calculated at the next step</Typography>
          <Typography variant="h6" sx={{ fontWeight: "bold", mt: 1 }}>
            Total: ₱
            {cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}
          </Typography>
          <Button
            fullWidth
            variant="contained"
            sx={{ bgcolor: "black", color: "white", mt: 2 }}
            onClick={() => navigate("/checkout")} // Navigate to the checkout page
          >
            Continue to checkout
          </Button>
        </Box>
      </Box>

      {/* Order Information */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Order Information</Typography>
        <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
          Return Policy
        </Typography>
        <Typography variant="body2" sx={{ color: "#666" }}>
          This is our example return policy which is everything you need to know about our returns.
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2">Shipping Options</Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2">Shipping Options</Typography>
      </Box>
    </Box>
  );
};

export default Cart;
