import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, CardMedia, Typography, Button, IconButton, Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { doc, collection, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase"; // Import Firestore instance

const ProductPage = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const navigate = useNavigate(); // For navigation
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");

  const handleAddToCart = async (product) => {
    console.log("🛒 Adding product to cart:", product);
  
    if (!product || !product.id || !product.name || !product.price) {
      console.error("❌ Invalid product data:", product);
      return;
    }
  
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("❌ User not authenticated");
        return;
      }
  
      if (!selectedSize) {
        console.error("❌ Please select a size before adding to cart.");
        return;
      }
  
      // Firestore structure: "users/{userId}/carts/{cartItemId-size}"
      const cartRef = collection(db, "users", user.uid, "carts");
      const itemRef = doc(cartRef, `${product.id}-${selectedSize}`); // Unique ID includes product ID and size
  
      const itemSnap = await getDoc(itemRef);
  
      if (itemSnap.exists()) {
        // If item with the same size already exists, update quantity
        await setDoc(
          itemRef,
          {
            quantity: itemSnap.data().quantity + quantity,
          },
          { merge: true }
        );
        console.log("🔄 Product quantity updated in cart!");
      } else {
        // Otherwise, add new item with the selected size
        await setDoc(itemRef, {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity, // Use selected quantity
          size: selectedSize, // Save selected size
          image: product.image || "", // Ensure image is stored
          addedAt: new Date(),
        });
        console.log("✅ Product added to cart!");
      }
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
    }
  };
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() }); // ✅ Ensure `id` is included
        } else {
          console.error("❌ No such product!");
        }
      } catch (error) {
        console.error("❌ Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);
  

  if (!product) {
    return (
      <Box
        sx={{
          backgroundColor: "#eff2f6",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ color: "gray" }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#eff2f6", minHeight: "100vh", py: 4 }}>
      <Box sx={{ width: "90%", maxWidth: 1200, margin: "auto", mt: 4 }}>
        <Grid container spacing={4}>
          {/* Left Section - Product Images */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={1}>
              {product.images && product.images.length > 0
                ? product.images.map((imageUrl, index) => (
                    <Grid item xs={6} key={index}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={imageUrl}
                        alt={product.name}
                        sx={{ borderRadius: 1, bgcolor: "#e0e0e0" }}
                      />
                    </Grid>
                  ))
                : [1, 2, 3, 4].map((_, index) => (
                    <Grid item xs={6} key={index}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={product.image || "https://via.placeholder.com/200"}
                        alt={product.name}
                        sx={{ borderRadius: 1, bgcolor: "#e0e0e0" }}
                      />
                    </Grid>
                  ))}
            </Grid>
          </Grid>

          {/* Right Section - Product Details */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>{product.name}</Typography>
            <Typography variant="h6" sx={{ fontWeight: 500, mt: 1 }}>${product.price}</Typography>
            <Typography variant="body1" sx={{ color: "gray", mt: 1 }}>
              {product.description}
            </Typography>
            <Typography variant="body2" sx={{ mt: 2, fontWeight: 600 }}>by Vendor Name</Typography>

            {/* Size Selection */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Size</Typography>
              {["S", "M", "L"].map((size) => (
                <Button 
                  key={size} 
                  variant={selectedSize === size ? "contained" : "outlined"}
                  onClick={() => setSelectedSize(size)}
                  sx={{ 
                    m: 0.5,
                    color: selectedSize === size ? "white" : "black",
                    backgroundColor: selectedSize === size ? "black" : "transparent",
                    borderColor: "black",
                    "&:hover": { backgroundColor: "black", color: "white" },
                  }}
                >
                  {size}
                </Button>
              ))}
            </Box>

            {/* Quantity Selector */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Quantity</Typography>
              <IconButton 
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                sx={{ border: "1px solid black", borderRadius: 1 }}
              >
                <RemoveIcon />
              </IconButton>
              <Typography>{quantity}</Typography>
              <IconButton 
                onClick={() => setQuantity((prev) => prev + 1)}
                sx={{ border: "1px solid black", borderRadius: 1 }}
              >
                <AddIcon />
              </IconButton>
            </Box>

            {/* Add to Cart Button */}
            <Button
              variant="contained"
              fullWidth
              onClick={() => handleAddToCart(product)}
              sx={{
                mt: 3,
                bgcolor: "black",
                color: "white",
                py: 1.5,
                fontSize: "1rem",
                "&:hover": { bgcolor: "black" },
              }}
            >
              Add to Cart - ${product.price * quantity}
            </Button>

            {/* Free Shipping & Returns */}
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
              <Typography variant="body2">Free standard shipping</Typography>
              <Typography variant="body2" sx={{ textDecoration: "underline", cursor: "pointer" }}>
                Free Returns
              </Typography>
            </Box>

            {/* Wishlist Button */}
            <IconButton sx={{ mt: 2 }}>
              <FavoriteBorderIcon />
            </IconButton>

            {/* Back Button */}
            <Button variant="text" sx={{ mt: 2 }} onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ProductPage;
