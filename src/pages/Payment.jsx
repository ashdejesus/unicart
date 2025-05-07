import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, setDoc, doc, serverTimestamp, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

const Payment = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const [cartItems, setCartItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvc: "",
  });
  const [errors, setErrors] = useState({});
  const [shippingInfo, setShippingInfo] = useState(null);
  const [loading, setLoading] = useState(false); // Added loading state

  const shippingFees = {
    jnt: 50,
    lbc: 60,
    ninja: 45,
  };

  useEffect(() => {
    const fetchCartAndShipping = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const cartRef = collection(db, "users", user.uid, "carts");
      const snapshot = await getDocs(cartRef);
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Combine cart items with same product (same name or id)
      const combinedItems = items.reduce((acc, item) => {
        const existingItem = acc.find(i => i.name === item.name);
        if (existingItem) {
          existingItem.quantity += item.quantity;
        } else {
          acc.push(item);
        }
        return acc;
      }, []);
      setCartItems(combinedItems);

      const shippingDoc = await getDoc(doc(db, "users", user.uid, "shippingInfo", "selectedShipping"));
      if (shippingDoc.exists()) {
        setShippingInfo(shippingDoc.data());
      }
    };
    fetchCartAndShipping();
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

  const handlePayment = async () => {
    if (paymentMethod !== "cod" && !validateForm()) {
      return;
    }

    setLoading(true); // Set loading to true when starting payment process

    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("❌ User not authenticated");
        return;
      }

      const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const shippingFee = shippingInfo ? (shippingFees[shippingInfo.shippingMethodId] || 0) : 0;
      const totalAmount = subtotal + shippingFee;

      // Get the existing order ID or use a new one
      const orderRef = doc(db, "users", user.uid, "orders", "order-1"); // Replace 'order-1' with your dynamic order ID logic

      // Fetch the existing order document
      const orderDoc = await getDoc(orderRef);

      const orderData = {
        shippingInfo,
        cartItems,
        paymentMethod,
        paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
        paymentInfo: {
          method: paymentMethod,
          status: paymentMethod === "cod" ? "pending" : "paid",
          amount: totalAmount,
          createdAt: serverTimestamp(),
          ...(paymentMethod === "card" && {
            card: {
              cardholderName: form.name,
              last4: form.cardNumber.slice(-4),
              expiryMonth: form.expiryMonth,
              expiryYear: form.expiryYear,
            },
          }),
        },
        totalAmount,
        status: paymentMethod === "cod" ? "awaiting_payment" : "paid",
        paymentDate: serverTimestamp(),
        createdAt: serverTimestamp(),
      };

      if (orderDoc.exists()) {
        // If order exists, update it with new payment details
        await setDoc(orderRef, orderData, { merge: true });
        console.log("✅ Order updated in Firestore");
      } else {
        // If no order exists, create it
        await setDoc(orderRef, orderData);
        console.log("✅ Order created in Firestore");
      }

      // If using COD, you can skip the payment processing part
      if (paymentMethod !== "cod") {
        // Simulate successful payment (In a real case, you'd integrate with a payment gateway like PayPal)
        const paymentRef = doc(db, "users", user.uid, "orders", "order-1");
        await setDoc(paymentRef, {
          ...orderData,
          paymentStatus: "paid", // Update payment status to 'paid' after successful transaction
          paymentDate: serverTimestamp(),
        }, { merge: true });
        console.log("✅ Payment processed successfully");
      }

      // Navigate to confirmation page after successful order
      navigate("/confirmation");
    } catch (error) {
      console.error("❌ Error saving payment and creating order:", error);
    } finally {
      setLoading(false); // Reset loading state after the process is complete
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = shippingInfo ? (shippingFees[shippingInfo.shippingMethodId] || 0) : 0;
  const totalAmount = total + shippingFee;

  return (
    <Box sx={{ maxWidth: "1200px", margin: "auto", p: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>Checkout</Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        <Typography sx={{ color: "#888" }}>Address</Typography>
        <Typography sx={{ color: "#888" }}>Shipping</Typography>
        <Typography sx={{ fontWeight: "bold" }}>Payment</Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 4 }}>
        <Box sx={{ flex: 2 }}>
          <ToggleButtonGroup value={paymentMethod} exclusive onChange={(e, val) => setPaymentMethod(val)}>
            <ToggleButton value="paypal">PayPal</ToggleButton>
            <ToggleButton value="card">Credit Card</ToggleButton>
            <ToggleButton value="cod">Cash on Delivery</ToggleButton>
          </ToggleButtonGroup>

          {paymentMethod === "card" && (
            <Box mt={3}>
              <TextField fullWidth label="Cardholder Name" name="name" value={form.name} onChange={handleInputChange} error={!!errors.name} helperText={errors.name} sx={{ mb: 2 }} />
              <TextField fullWidth label="Card Number" name="cardNumber" value={form.cardNumber} onChange={handleInputChange} error={!!errors.cardNumber} helperText={errors.cardNumber} sx={{ mb: 2 }} />
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField select label="Month" name="expiryMonth" value={form.expiryMonth} onChange={handleInputChange} error={!!errors.expiryMonth} helperText={errors.expiryMonth} sx={{ flex: 1 }} />
                <TextField select label="Year" name="expiryYear" value={form.expiryYear} onChange={handleInputChange} error={!!errors.expiryYear} helperText={errors.expiryYear} sx={{ flex: 1 }} />
                <TextField label="CVC" name="cvc" value={form.cvc} onChange={handleInputChange} error={!!errors.cvc} helperText={errors.cvc} sx={{ flex: 1 }} />
              </Box>
            </Box>
          )}

          <Button fullWidth variant="contained" sx={{ bgcolor: "black", mt: 2 }} onClick={handlePayment} disabled={loading}>
            {loading ? "Processing..." : (paymentMethod === "paypal" ? "Pay with PayPal" :
               paymentMethod === "card" ? "Pay with Card" : "Place Order (COD)") }
          </Button>
        </Box>

        <Box sx={{ flex: 1, bgcolor: "#eff2f6", p: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>Your Cart</Typography>
          {cartItems.map((item) => (
            <Box key={item.id} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Box component="img" src={item.image || "https://via.placeholder.com/80"} alt={item.name} sx={{ width: 80, height: 80, borderRadius: 1, objectFit: "cover", mr: 2 }} />
              <Box>
                <Typography variant="subtitle1">{item.name}</Typography>
                <Typography variant="body2">Size: {item.size}</Typography>
                <Typography variant="body2">Qty: {item.quantity}</Typography>
                <Typography variant="subtitle2" sx={{ mt: 1 }}>₱{item.price * item.quantity}</Typography>
              </ Box>
</Box>
))}
      <Typography variant="body1" sx={{ mt: 2 }}>Subtotal: ₱{total.toFixed(2)}</Typography>
      <Typography variant="body1">Shipping: ₱{shippingFee.toFixed(2)}</Typography>
      <Typography variant="h6" sx={{ fontWeight: "bold", mt: 1 }}>Total: ₱{totalAmount.toFixed(2)}</Typography>
    </Box>
  </Box>
</Box>
);
};

export default Payment;
