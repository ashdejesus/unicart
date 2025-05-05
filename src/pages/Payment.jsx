import React, { useState, useEffect } from "react";
import {
  Box, Typography, Button, TextField, ToggleButtonGroup, ToggleButton, MenuItem, FormHelperText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";

const Payment = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const [cartItems, setCartItems] = useState([]);
  const [form, setForm] = useState({
    name: "", cardNumber: "", expiryMonth: "", expiryYear: "", cvc: "",
  });
  const [errors, setErrors] = useState({});

  // Fetch cart data
  useEffect(() => {
    const fetchCart = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const cartRef = collection(db, "users", user.uid, "carts");
      const snapshot = await getDocs(cartRef);
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCartItems(items);
    };
    fetchCart();
  }, []);

  const handleInputChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (paymentMethod === "card") {
      if (!form.name) newErrors.name = "Cardholder name is required";
      if (!form.cardNumber.match(/^\d{16}$/)) newErrors.cardNumber = "Card number must be 16 digits";
      if (!form.expiryMonth) newErrors.expiryMonth = "Expiry month required";
      if (!form.expiryYear) newErrors.expiryYear = "Expiry year required";
      if (!form.cvc.match(/^\d{3}$/)) newErrors.cvc = "CVC must be 3 digits";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = () => {
    if (validateForm()) {
      // dummy logic
      console.log("✅ Payment successful");
      navigate("/confirmation");
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Box sx={{ maxWidth: "1200px", margin: "auto", p: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>checkout</Typography>

      {/* Stepper */}
      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        <Typography sx={{ color: "#888" }}>Address</Typography>
        <Typography sx={{ color: "#888" }}>Shipping</Typography>
        <Typography sx={{ fontWeight: "bold" }}>Payment</Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 4 }}>
        {/* Payment Section */}
        <Box sx={{ flex: 2 }}>
          <ToggleButtonGroup value={paymentMethod} exclusive onChange={(e, val) => setPaymentMethod(val)}>
            <ToggleButton value="paypal">PayPal</ToggleButton>
            <ToggleButton value="card">Credit Card</ToggleButton>
          </ToggleButtonGroup>

          {paymentMethod === "card" && (
            <Box mt={3}>
              <TextField
                fullWidth
                label="Cardholder Name"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                error={!!errors.name}
                helperText={errors.name}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Card Number"
                name="cardNumber"
                value={form.cardNumber}
                onChange={handleInputChange}
                error={!!errors.cardNumber}
                helperText={errors.cardNumber}
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                  select
                  label="Month"
                  name="expiryMonth"
                  value={form.expiryMonth}
                  onChange={handleInputChange}
                  error={!!errors.expiryMonth}
                  helperText={errors.expiryMonth}
                  sx={{ flex: 1 }}
                >
                  {[...Array(12)].map((_, i) => (
                    <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label="Year"
                  name="expiryYear"
                  value={form.expiryYear}
                  onChange={handleInputChange}
                  error={!!errors.expiryYear}
                  helperText={errors.expiryYear}
                  sx={{ flex: 1 }}
                >
                  {[...Array(10)].map((_, i) => {
                    const year = new Date().getFullYear() + i;
                    return <MenuItem key={year} value={year}>{year}</MenuItem>;
                  })}
                </TextField>
                <TextField
                  label="CVC"
                  name="cvc"
                  value={form.cvc}
                  onChange={handleInputChange}
                  error={!!errors.cvc}
                  helperText={errors.cvc}
                  sx={{ flex: 1 }}
                />
              </Box>
            </Box>
          )}

          <Button fullWidth variant="contained" sx={{ bgcolor: "black", mt: 2 }} onClick={handlePayment}>
            {paymentMethod === "paypal" ? "Pay with PayPal" : "Pay with card"}
          </Button>
        </Box>

        {/* Cart Summary */}
        <Box sx={{ flex: 1, bgcolor: "#eff2f6", p: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>Your Cart</Typography>

          {cartItems.map((item) => (
            <Box key={item.id} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Box
                component="img"
                src={item.image || "https://via.placeholder.com/80"}
                alt={item.name}
                sx={{ width: 80, height: 80, borderRadius: 1, objectFit: "cover", mr: 2 }}
              />
              <Box>
                <Typography variant="subtitle1">{item.name}</Typography>
                <Typography variant="body2">Size: {item.size}</Typography>
                <Typography variant="body2">Qty: {item.quantity}</Typography>
                <Typography variant="subtitle2" sx={{ mt: 1 }}>₱{item.price * item.quantity}</Typography>
              </Box>
            </Box>
          ))}

          <Typography variant="body1" sx={{ mt: 2 }}>Subtotal: ₱{total.toFixed(2)}</Typography>
          <Typography variant="body1">Shipping: Calculated next</Typography>
          <Typography variant="h6" sx={{ fontWeight: "bold", mt: 1 }}>Total: ₱{total.toFixed(2)}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Payment;
