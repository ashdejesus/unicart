import React, { useState } from "react";
import { Box, Typography, IconButton, Button, Grid, Divider, TextField } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const images = [
  "https://via.placeholder.com/1920x800", 
  "https://via.placeholder.com/1920x800",
  "https://via.placeholder.com/1920x800"
];

const categories = [
  { name: "Street Wear", image: "https://via.placeholder.com/500/CCCCCC/808080?text=Placeholder" },
  { name: "Men’s Wear", image: "https://via.placeholder.com/500/CCCCCC/808080?text=Placeholder" },
  { name: "Women’s Wear", image: "https://via.placeholder.com/500/CCCCCC/808080?text=Placeholder" },
];

const products = [
  { name: "Shirt", price: "$99", image: "https://via.placeholder.com/300" },
  { name: "Short", price: "$99", image: "https://via.placeholder.com/300" },
  { name: "Jacket", price: "$99", image: "https://via.placeholder.com/300" }
];

const Dashboard = () => {
  const [currentImage, setCurrentImage] = useState(0);

  const handleNext = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
  sx={{
    position: "relative",
    width: "100vw", // Ensures full screen width
    height: "100vh",
    backgroundImage: `url(${images[currentImage]})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    overflow: "hidden",
    "&::after": {
      content: "''",
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.1), rgba(0,0,0,0.7))",
      zIndex: 1,
    },
  }}
>

        <Box sx={{ position: "relative", zIndex: 2, color: "white", px: 3 }}>
          <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
            Welcome to UniCart
          </Typography>
          <Typography variant="h6">
            Browse our latest products and best deals!
          </Typography>
        </Box>

        <IconButton onClick={handlePrev} sx={{ position: "absolute", left: 20, color: "white", zIndex: 3, backgroundColor: "rgba(0,0,0,0.5)", borderRadius: "50%" }}>
          <ArrowBackIosNewIcon fontSize="large" />
        </IconButton>
        <IconButton onClick={handleNext} sx={{ position: "absolute", right: 20, color: "white", zIndex: 3, backgroundColor: "rgba(0,0,0,0.5)", borderRadius: "50%" }}>
          <ArrowForwardIosIcon fontSize="large" />
        </IconButton>
      </Box>

      {/* Categories Section */}
<Box sx={{ textAlign: "center", py: 5, backgroundColor: "#ffffff" }}>
  <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
    Categories
  </Typography>
  <Typography variant="body1" sx={{ mb: 3, maxWidth: "600px", mx: "auto", color: "#777" }}>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
  </Typography>

  {/* Shop All Button */}
  <Button
    variant="outlined"
    sx={{
      border: "2px solid black",
      color: "black",
      fontWeight: "bold",
      px: 4,
      py: 1.5,
      mb: 4,
      "&:hover": { backgroundColor: "black", color: "white" },
    }}
  >
    Shop All
  </Button>

  {/* Categories Grid */}
  <Grid container spacing={2} justifyContent="center">
    {categories.map((category, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <Box sx={{ textAlign: "center" }}>
          <Box
            component="img"
            src={category.image}
            alt={category.name}
            sx={{ width: "100%", height: "250px", objectFit: "cover", borderRadius: "10px" }}
          />
          <Typography variant="h6" sx={{ fontWeight: "bold", mt: 2 }}>
            {category.name}
          </Typography>
        </Box>
      </Grid>
    ))}
  </Grid>
</Box>

      {/* Our Products Section */}
      <Box sx={{ textAlign: "center", py: 5, backgroundColor: "#ffffff" }}>
        <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
          Our Products
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {products.map((product, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box sx={{ textAlign: "center" }}>
                <Box
                  component="img"
                  src={product.image}
                  alt={product.name}
                  sx={{ width: "100%", height: "250px", objectFit: "cover", borderRadius: "10px" }}
                />
                <Typography variant="h6" sx={{ fontWeight: "bold", mt: 2 }}>
                  {product.name}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {product.price}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Divider */}
      <Divider sx={{ my: 5, backgroundColor: "#ddd" }} />
{/* Footer */}
<Box sx={{ width: "100vw", backgroundColor: "#ffffff", py: 10, px: 3 }}>
  <Grid container spacing={4} alignItems="center ">
    {/* Left Side: Newsletter Signup Form */}
    <Grid item xs={12} md={6}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
        Sign up for our newsletter
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Be the first to know about our special offers, news, and updates.
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <TextField label="Email Address" variant="outlined" sx={{ flex: 1 }} />
        <Button
          variant="contained"
          sx={{ backgroundColor: "black", color: "white", "&:hover": { backgroundColor: "#333" } }}
        >
          Sign Up
        </Button>
      </Box>
    </Grid>

    {/* Right Side: Lorem Ipsum Links */}
    <Grid item xs={12} md={6}>
      <Grid container spacing={2}>
        {["Lorem Ipsum", "Lorem Ipsum", "Lorem Ipsum"].map((title, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>{title}</Typography>
            {["Lorem", "Lorem", "Lorem", "Lorem", "Lorem"].map((text, i) => (
              <Typography key={i} variant="body2" sx={{ color: "#555" }}>
                {text}
              </Typography>
            ))}
          </Grid>
        ))}
      </Grid>
    </Grid>
  </Grid>
</Box>


      {/* Copyright */}
      <Box sx={{ backgroundColor: "black", color: "white", textAlign: "center", py: 2 }}>
        <Typography variant="body2">
          COPYRIGHTS SITE.COM. ALL RIGHTS RESERVED
        </Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;
