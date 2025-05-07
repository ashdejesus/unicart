import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, Button, Grid } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";

const images = [
  "/images/a1.jpg",
  "/images/a2.jpg",
  "/images/a3.jpg",
  "/images/a4.jpg"
];

const categories = [
  {
    name: "Street Wear",
    image:
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/9b7818b3-2bad-47f6-94af-040e1b9ab51b/AS+M+NK+CLUB+SS+POLO+PIQUE.png",
    description: "Urban-inspired styles for those who live life boldly and love the edge of the streets."
  },
  {
    name: "Men’s Wear",
    image:
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/8ea28d98-eb23-4564-b48f-c1a0248f91d2/AS+U+NK+WVN+TWILL+PREM+JKT+GCE.png",
    description: "Classic and modern menswear designed for comfort, performance, and effortless style."
  },
  {
    name: "Women’s Wear",
    image:
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/89d5183a-8a5c-4d98-914b-9b751c9e90f4/AS+W+NK+ONE+FITTED+DF+SS+TOP.png",
    description: "Empowering silhouettes and chic essentials that bring confidence to every step."
  }
];

const products = [
  {
    name: "Shirt",
    image:
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/46bb8147-9ced-4025-877f-5736285b29f3/AS+M+NSW+PREM+ESSNTL+TEE+OPP1.png",
    description: "Soft, breathable, and effortlessly cool — perfect for casual days or layered looks."
  },
  {
    name: "Short",
    image:
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/c6aff5fb-eb30-4bc0-8308-2dc186e3dbf2/AS+W+NSW+NK+WR+WVN+MR+2IN+SH.png",
    description: "Lightweight and flexible, these shorts move with you whether you’re at the gym or on the go."
  },
  {
    name: "Jacket",
    image:
      "https://brand.assets.adidas.com/image/upload/f_auto,q_auto,fl_lossy/sportswear_fw24_zne_launch_pdp_hero_look_2_banner_split_a_d_573bd96a59.jpg",
    description: "Stay cozy and sharp with a sleek jacket that blends performance and fashion."
  }
];

const Dashboard = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleShopAll = () => {
    navigate("/shop");
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          width: "100vw",
          height: "100vh",
          backgroundImage: `url(${images[currentImage]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          overflow: "hidden",
          m: 0,
          p: 0,
          "&::after": {
            content: "''",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.1), rgba(0,0,0,0.7))",
            zIndex: 1
          }
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

        <IconButton
          onClick={handlePrev}
          sx={{
            position: "absolute",
            left: 20,
            color: "white",
            zIndex: 3,
            backgroundColor: "rgba(0,0,0,0.5)",
            borderRadius: "50%"
          }}
        >
          <ArrowBackIosNewIcon fontSize="large" />
        </IconButton>
        <IconButton
          onClick={handleNext}
          sx={{
            position: "absolute",
            right: 20,
            color: "white",
            zIndex: 3,
            backgroundColor: "rgba(0,0,0,0.5)",
            borderRadius: "50%"
          }}
        >
          <ArrowForwardIosIcon fontSize="large" />
        </IconButton>
      </Box>

      {/* Categories Section */}
      <Box sx={{ textAlign: "center", py: 5, backgroundColor: "#eff2f6" }}>
        <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
          Categories
        </Typography>
        <Typography
          variant="body1"
          sx={{ mb: 3, maxWidth: "600px", mx: "auto", color: "#777" }}
        >
          Explore our curated categories designed to match your lifestyle and
          elevate your look.
        </Typography>

        <Button
          variant="outlined"
          onClick={handleShopAll}
          sx={{
            border: "2px solid black",
            color: "black",
            fontWeight: "bold",
            px: 4,
            py: 1.5,
            mb: 4,
            "&:hover": { backgroundColor: "black", color: "white" }
          }}
        >
          Shop All
        </Button>

        <Grid container spacing={2} justifyContent="center">
          {categories.map((category, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box sx={{ textAlign: "center" }}>
                <Box
                  component="img"
                  src={category.image}
                  alt={category.name}
                  sx={{
                    width: "100%",
                    height: "250px",
                    objectFit: "cover",
                    borderRadius: "10px"
                  }}
                />
                <Typography variant="h6" sx={{ fontWeight: "bold", mt: 2 }}>
                  {category.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "#555", mt: 1 }}>
                  {category.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Our Products Section */}
      <Box sx={{ textAlign: "center", py: 5, backgroundColor: "#eff2f6" }}>
        <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
          Our Products
        </Typography>
        <Typography
          variant="body1"
          sx={{ mb: 3, maxWidth: "600px", mx: "auto", color: "#777" }}
        >
          Handpicked essentials designed to keep you stylish, comfortable, and
          ready for anything.
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {products.map((product, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box sx={{ textAlign: "center" }}>
                <Box
                  component="img"
                  src={product.image}
                  alt={product.name}
                  sx={{
                    width: "100%",
                    height: "250px",
                    objectFit: "cover",
                    borderRadius: "10px"
                  }}
                />
                <Typography variant="h6" sx={{ fontWeight: "bold", mt: 2 }}>
                  {product.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "#555", mt: 1 }}>
                  {product.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
