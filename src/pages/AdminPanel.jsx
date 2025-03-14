import React, { useState, useEffect } from "react";
import supabase from "../supabaseClient"; // Import Supabase
import { auth, db, onAuthStateChanged, checkAdmin } from "../firebase";
import { collection, addDoc, updateDoc, deleteDoc, getDocs, doc } from "firebase/firestore";
import { Box, Button, TextField, Typography, Grid, Container, Paper } from "@mui/material";

const AdminPanel = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", image: null });

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

  const handleAddProduct = async () => {
    try {
      if (!newProduct.name || !newProduct.price || !newProduct.image) {
        alert("Please enter all product details and select an image.");
        return;
      }

      const imageFile = newProduct.image;
      const fileName = `${Date.now()}_${imageFile.name}`; // Unique filename

      // Upload image to Supabase Storage
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
        image: imageUrl, // Store the Supabase image URL in Firestore
      };

      await addDoc(collection(db, "products"), productData);
      fetchProducts();
      console.log("Product added:", productData);

      // Reset form after successful upload
      setNewProduct({ name: "", price: "", image: null });
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
    <Container sx={{ backgroundColor: "#eff2f6", minHeight: "100vh", py: 4 }}>
      <Typography variant="h4" sx={{ my: 4 }}>Admin Panel</Typography>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Add New Product</Typography>
        <Box component="form" noValidate autoComplete="off">
          <TextField
            label="Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />

          {/* Image Upload Field */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })}
          />

          <Button variant="contained" color="primary" onClick={handleAddProduct}>
            Add Product
          </Button>
        </Box>
      </Paper>

      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">{product.name}</Typography>
              <Typography variant="body1">{product.price}</Typography>

              {/* Fix Image Display - Only Show if URL Exists */}
              {product.image && (
                <img src={product.image} alt={product.name} width="100%" />
              )}

              <Button
                variant="contained"
                color="secondary"
                sx={{ mt: 2 }}
                onClick={() => handleUpdateProduct(product.id, { name: "Updated Name" })}
              >
                Update
              </Button>
              <Button
                variant="contained"
                color="error"
                sx={{ mt: 2 }}
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
