import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { collection, getDocs, deleteDoc, doc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    address: "",
    city: "",
    zipCode: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // For displaying error messages
  const [couponCode, setCouponCode] = useState(""); // For coupon code
  const navigate = useNavigate();

  // Fetch cart items
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.error("❌ User not authenticated");
          setError("You need to log in to access your cart.");
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
        setError("There was an error fetching your cart items.");
      }
    };

    fetchCartItems();
  }, []);

  // Remove item from cart
  const removeCartItem = async (itemId) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const itemRef = doc(db, "users", user.uid, "carts", itemId);
      await deleteDoc(itemRef);

      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== itemId)
      );
    } catch (error) {
      console.error("❌ Error removing cart item:", error);
      setError("There was an error removing the item.");
    }
  };

  // Handle continue to shipping page
  const handleContinueToShipping = async () => {
    setLoading(true);

    const { fullName, address, city, zipCode, phoneNumber } = shippingInfo;
    if (!fullName || !address || !city || !zipCode || !phoneNumber) {
      alert("Please fill in all the shipping fields.");
      setLoading(false);
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("❌ User not authenticated");
        setLoading(false);
        return;
      }

      const userName = user.displayName || "Unknown Customer";

      const shippingRef = doc(db, "users", user.uid, "shippingInfo", "details");
      await setDoc(shippingRef, shippingInfo);

      const orderId = Date.now().toString(); // 👈 generate custom ID here
      const orderRef = doc(db, "users", user.uid, "orders", orderId); // 👈 use that ID here
      const orderData = {
        customerName: userName,
        shippingAddress: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.zipCode}`,
        shippingInfo,
        cartItems,
        subtotal: cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
        paymentMethod: "cod",
        status: "pending",
        paymentStatus: "pending",
        createdAt: new Date(),
      };

      await setDoc(orderRef, orderData);

      navigate("/shipping");
    } catch (error) {
      console.error("❌ Error saving shipping information and order:", error);
      setError("There was an error saving your order.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate the subtotal
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.price * item.quantity || 0),
    0
  );

  // Prevent the checkout button from being clicked if the cart is empty
  const isCartEmpty = cartItems.length === 0;

  return (
    <Box sx={{ maxWidth: "1200px", margin: "auto", padding: "20px" }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>
        Checkout
      </Typography>

      {/* Error Message */}
      {error && (
        <Typography variant="body1" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* Step Indicator */}
      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        <Typography sx={{ fontWeight: "bold" }}>Address</Typography>
        <Typography sx={{ color: "#888" }}>Shipping</Typography>
        <Typography sx={{ color: "#888" }}>Payment</Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 4 }}>
        {/* Shipping Info Form */}
        <Box sx={{ flex: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Shipping Information
          </Typography>

          <TextField
            fullWidth
            label="Full Name"
            variant="outlined"
            sx={{ mb: 2 }}
            value={shippingInfo.fullName}
            onChange={(e) =>
              setShippingInfo({ ...shippingInfo, fullName: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="Address"
            variant="outlined"
            sx={{ mb: 2 }}
            value={shippingInfo.address}
            onChange={(e) =>
              setShippingInfo({ ...shippingInfo, address: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="City"
            variant="outlined"
            sx={{ mb: 2 }}
            value={shippingInfo.city}
            onChange={(e) =>
              setShippingInfo({ ...shippingInfo, city: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="Zip Code"
            variant="outlined"
            sx={{ mb: 2 }}
            value={shippingInfo.zipCode}
            onChange={(e) =>
              setShippingInfo({ ...shippingInfo, zipCode: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="Phone Number"
            variant="outlined"
            sx={{ mb: 2 }}
            value={shippingInfo.phoneNumber}
            onChange={(e) =>
              setShippingInfo({ ...shippingInfo, phoneNumber: e.target.value })
            }
          />

          {/* Loading Spinner */}
          {loading ? (
            <CircularProgress />
          ) : (
            <Button
              variant="contained"
              fullWidth
              sx={{ bgcolor: "black", color: "white", mt: 1 }}
              onClick={handleContinueToShipping}
              disabled={isCartEmpty} // Disable if cart is empty
            >
              Continue to shipping
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
                <IconButton onClick={() => removeCartItem(item.id)}>
                  <DeleteIcon />
                </IconButton>
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
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />

          <Typography variant="body1">
            Subtotal: ₱{subtotal.toFixed(2)}
          </Typography>
          <Typography variant="body1">
            Shipping: Calculated at the next step
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: "bold", mt: 1 }}>
            Total: ₱{subtotal.toFixed(2)}
          </Typography>
        </Box>
      </Box>

      {/* Info Footer */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Shipping Details</Typography>
        <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
          We deliver within 3-5 business days through our trusted couriers.
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2">Return & Exchange Policy</Typography>
        <Typography variant="body2" sx={{ color: "#666" }}>
          Our hassle-free returns ensure peace of mind. Return within 7 days for eligible items.
        </Typography>
      </Box>
    </Box>
  );
};

export default Checkout;
