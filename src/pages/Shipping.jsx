import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebase"; // Import Firebase instance

const shippingOptions = [
  {
    id: "jnt",
    name: "J&T Express",
    duration: "2-4 Business Days",
  },
  {
    id: "lbc",
    name: "LBC Express",
    duration: "1-3 Business Days",
  },
  {
    id: "ninja",
    name: "Ninja Van",
    duration: "3-5 Business Days",
  },
];

const Shipping = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("jnt");
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state for fetching cart items

  // Fetch cart items from Firebase
  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true); // Show loading spinner while fetching data
      try {
        const user = auth.currentUser;
        if (!user) {
          console.error("❌ User not authenticated");
          navigate("/login"); // Redirect to login if the user is not authenticated
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
      } finally {
        setLoading(false); // Hide loading spinner after fetching data
      }
    };

    fetchCartItems();
  }, [navigate]);

  const handleContinueToPayment = async () => {
    if (!cartItems.length) {
      alert("Your cart is empty! Please add items before proceeding.");
      return;
    }
  
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("❌ User not authenticated");
        navigate("/login");
        return;
      }
  
      // Fetch the most recent order (assuming orderId = timestamp-based)
      const ordersCollectionRef = collection(db, "users", user.uid, "orders");
      const ordersSnapshot = await getDocs(ordersCollectionRef);
  
      if (ordersSnapshot.empty) {
        alert("No order found! Please start checkout first.");
        return;
      }
  
      // Find the latest order by createdAt (timestamp)
      const orders = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      const latestOrder = orders.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())[0];
  
      if (!latestOrder) {
        alert("No order found! Please start checkout first.");
        return;
      }
  
      const latestOrderRef = doc(db, "users", user.uid, "orders", latestOrder.id);
  
      // Update the latest order with selected shipping option
      await setDoc(
        latestOrderRef,
        {
          shippingMethod: {
            id: selectedOption,
            name: shippingOptions.find(opt => opt.id === selectedOption)?.name || "",
            duration: shippingOptions.find(opt => opt.id === selectedOption)?.duration || "",
          },
        },
        { merge: true } // 👉 merge: true to only update shippingMethod field
      );
  
      navigate("/payment"); // Move to the payment step
    } catch (error) {
      console.error("❌ Error updating shipping option in order:", error);
    }
  };
  
  return (
    <Box sx={{ maxWidth: "1200px", margin: "auto", padding: "20px" }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>
        Checkout
      </Typography>

      {/* Step indicator */}
      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        <Typography sx={{ color: "#888" }}>Address</Typography>
        <Typography sx={{ fontWeight: "bold" }}>Shipping</Typography>
        <Typography sx={{ color: "#888" }}>Payment</Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 4 }}>
        {/* Shipping options */}
        <Box sx={{ flex: 2 }}>
          <RadioGroup
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            {shippingOptions.map((option) => (
              <Box
                key={option.id}
                sx={{
                  border: selectedOption === option.id ? "2px solid black" : "1px solid #ddd",
                  borderRadius: 2,
                  padding: 2,
                  mb: 2,
                }}
              >
                <FormControlLabel
                  value={option.id}
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography sx={{ fontWeight: "bold" }}>{option.name}</Typography>
                      <Typography variant="body2">{option.duration}</Typography>
                    </Box>
                  }
                />
              </Box>
            ))}
          </RadioGroup>

          {loading ? (
            <CircularProgress sx={{ mt: 2 }} /> // Show loading spinner while processing
          ) : (
            <Button
              fullWidth
              variant="contained"
              sx={{ bgcolor: "black", color: "white", mt: 2 }}
              onClick={handleContinueToPayment}
            >
              Continue to payment
            </Button>
          )}
        </Box>

        {/* Cart Summary */}
        <Box sx={{ flex: 1, bgcolor: "#eff2f6", padding: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Order Summary
          </Typography>

          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: "flex",
                  borderBottom: "1px solid #ddd",
                  paddingY: 2,
                  alignItems: "center",
                }}
              >
                <Box
                  component="img"
                  src={item.image || "https://via.placeholder.com/80"}
                  alt={item.name}
                  sx={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "8px",
                    objectFit: "cover",
                    mr: 2,
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6">{item.name}</Typography>
                  <Typography variant="body2">Size: {item.size}</Typography>
                  <Typography variant="body2">Quantity: {item.quantity}</Typography>
                  <Typography variant="body2" sx={{ color: "#888" }}>
                    by {item.vendor || "Unknown Vendor"}
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    ₱{(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            ))
          ) : (
            <Typography
              variant="body1"
              sx={{ textAlign: "center", color: "#666", py: 3 }}
            >
              Your cart is empty.
            </Typography>
          )}

          <TextField
            fullWidth
            placeholder="Enter coupon code here"
            variant="outlined"
            size="small"
            sx={{ mb: 2, mt: 2 }}
          />

          <Typography variant="body1">
            Subtotal: ₱{cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}
          </Typography>
          <Typography variant="body1">
            Shipping: Calculated at the next step
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: "bold", mt: 1 }}>
            Total: ₱{cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Shipping;
