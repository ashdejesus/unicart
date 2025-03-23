import React, { useState, useEffect } from "react";
import supabase from "../supabaseClient"; // Import Supabase
import { auth, db, onAuthStateChanged, checkAdmin } from "../firebase";
import { collection, addDoc, updateDoc, deleteDoc, getDocs, doc } from "firebase/firestore";
import { Box, Button, TextField, Typography, Grid, Container, Paper, MenuItem, Select, InputLabel, FormControl } from "@mui/material";

const AdminPanel = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    image: null,
  });

  const categories = [
    "Oversized Jackets",
    "Techwear Jackets",
    "Cropped Jackets",
    "Vintage Jackets",
    "Streetwear Puffers",
    "Utility Jackets",
  ];

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const isAdmin = await checkAdmin(user.uid);
        setIsAdmin(isAdmin);
        console.log("User is admin:", isAdmin);
      } else {
        setUser(null);
        setIsAdmin(false);
        console.log("No user logged in");
      }
    });
  }, []);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productsList);
      console.log("Fetched products:", productsList);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    setNewProduct((prev) => ({ ...prev, category: e.target.value }));
  };

  const handleAddProduct = async () => {
    try {
      if (!newProduct.name || !newProduct.price || !newProduct.image) {
        alert("Please enter all product details and select an image.");
        return;
      }

      const imageFile = newProduct.image;
      const fileName = `${Date.now()}_${imageFile.name}`; // Unique filename

      // Upload image to Supabase Storage
      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(fileName, imageFile);

      if (error || !data) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image.");
        return;
      }

      // Get the public URL of uploaded image
      const { data: urlData } = await supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      if (!urlData) {
        console.error("Error retrieving image URL");
        alert("Failed to get image URL.");
        return;
      }

      const imageUrl = urlData.publicUrl;

      // Store product info in Firestore
      const productData = {
        name: newProduct.name,
        price: newProduct.price,
        description: newProduct.description,
        category: newProduct.category,
        image: imageUrl, // Store the Supabase image URL in Firestore
      };

      await addDoc(collection(db, "products"), productData);
      fetchProducts();
      console.log("Product added:", productData);

      // Reset form after successful upload
      setNewProduct({ name: "", price: "", description: "", category: "", image: null });
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleUpdateProduct = async (id, updatedProduct) => {
    try {
      const productRef = doc(db, "products", id);
      await updateDoc(productRef, updatedProduct);
      fetchProducts();
      console.log("Product updated:", updatedProduct);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const productRef = doc(db, "products", id);
      await deleteDoc(productRef);
      fetchProducts();
      console.log("Product deleted:", id);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
    }
  }, [isAdmin]);

  if (!user) {
    return <Typography>Please log in to access the admin panel.</Typography>;
  }

  if (!isAdmin) {
    return <Typography>You do not have access to this page.</Typography>;
  }

  return (
    <Container
      sx={{
        backgroundColor: "#eff2f6", // Set the full background color
        minHeight: "100vh",
        py: 4,
        px: { xs: 2, md: 4 }, // Add padding for smaller screens
      }}
    >
      <Typography variant="h4" sx={{ my: 4 }}>
        Admin Panel
      </Typography>
      <Paper
        sx={{
          p: 4,
          mb: 4,
          backgroundColor: "#eff2f6", // Match the background color
          boxShadow: "none", // Remove shadow for a flat design
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Add New Product
        </Typography>
        <Box component="form" noValidate autoComplete="off">
          <TextField
            label="Name"
            name="name"
            value={newProduct.name}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Price"
            name="price"
            value={newProduct.price}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            name="description"
            value={newProduct.description}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select value={newProduct.category} onChange={handleCategoryChange}>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Image Upload Field */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setNewProduct({ ...newProduct, image: e.target.files[0] })
            }
            style={{
              marginBottom: "16px",
              display: "block",
            }}
          />

          <Button variant="contained" color="primary" onClick={handleAddProduct}>
            Add Product
          </Button>
        </Box>
      </Paper>

      <Grid
  container
  spacing={3}
  sx={{
    backgroundColor: "#eff2f6", // Match the full background color
    borderRadius: "8px",
    p: 2,
  }}
>
  {products.map((product) => (
    <Grid item xs={6} sm={6} md={4} key={product.id}> {/* Two columns on mobile */}
      <Paper
        sx={{
          p: 2,
          backgroundColor: "#fff", // Keep product cards white for contrast
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "scale(1.02)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        {/* Product Image */}
        {product.image && (
          <Box
            component="img"
            src={product.image}
            alt={product.name}
            sx={{
              width: "100%",
              height: "200px",
              objectFit: "cover",
              borderRadius: "8px",
              mb: 2,
            }}
          />
        )}

        {/* Product Details */}
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
          {product.name}
        </Typography>
        <Typography variant="body1" sx={{ color: "gray", mb: 1 }}>
          Price: ${product.price}
        </Typography>
        <Typography variant="body2" sx={{ color: "gray", mb: 2 }}>
          Category: {product.category}
        </Typography>

        {/* Action Buttons */}
        <Button
          variant="contained"
          color="primary"
          sx={{ mr: 1 }}
          onClick={() => handleUpdateProduct(product.id, { name: "Updated Name" })}
        >
          Update
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => handleDeleteProduct(product.id)}
        >
          Delete
        </Button>
      </Paper>
    </Grid>
  ))}
</Grid>
    </Container>
  );
};

export default AdminPanel;
