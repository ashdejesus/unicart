import React, { useState, useEffect } from "react";
import { Box, Typography, Radio, RadioGroup, FormControlLabel, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
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
  const [selectedOption, setSelectedOption] = useState("jnt");
  const [cartItems, setCartItems] = useState([]); // State to store cart items
  const navigate = useNavigate();

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

  const handleContinue = () => {
    // Pass shipping option via global state or query param if needed
    navigate("/checkout/payment");
  };

  return (
    <Box sx={{ maxWidth: "1200px", margin: "auto", padding: "20px" }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>
        checkout
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

          <Button
            fullWidth
            variant="contained"
            sx={{ bgcolor: "black", color: "white", mt: 2 }}
            onClick={handleContinue}
          >
            Continue to payment
          </Button>
        </Box>

        {/* Cart summary */}
        <Box sx={{ flex: 1, bgcolor: "#eff2f6", padding: 2, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Your cart
          </Typography>
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <Box key={item.id} sx={{ display: "flex", mb: 2 }}>
                <Box
                  component="img"
                  src={item.image || "https://via.placeholder.com/60"}
                  alt={item.name}
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: 1,
                    objectFit: "cover",
                    mr: 2,
                  }}
                />
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    {item.name}
                  </Typography>
                  <Typography variant="body2">Size: {item.size}</Typography>
                  <Typography variant="body2">Quantity: {item.quantity}</Typography>
                  <Typography variant="body1" sx={{ fontWeight: "bold", mt: 1 }}>
                    ₱{item.price * item.quantity}
                  </Typography>
                </Box>
              </Box>
            ))
          ) : (
            <Typography variant="body2" sx={{ color: "#888" }}>
              Your cart is empty.
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Shipping;