import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { 
  Container, Grid, Card, CardContent, Typography, 
  CardMedia, FormGroup, FormControlLabel, Checkbox, 
  Select, MenuItem, Box, Modal, Button, IconButton 
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filters, setFilters] = useState({
    maleWear: false,
    womenWear: false,
    caps: false,
    shoes: false,
  });
  const [sortBy, setSortBy] = useState("popular");
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productsData);
      setFilteredProducts(productsData);
    };
    fetchProducts();
  }, []);

  const handleFilterChange = (event) => {
    const newFilters = { ...filters, [event.target.name]: event.target.checked };
    setFilters(newFilters);
    applyFiltersAndSort(newFilters, sortBy);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    applyFiltersAndSort(filters, event.target.value);
  };

  const applyFiltersAndSort = (filterOptions, sortOption) => {
    let filtered = products;
    const activeFilters = Object.keys(filterOptions).filter(key => filterOptions[key]);
    if (activeFilters.length > 0) {
      filtered = products.filter(product => activeFilters.includes(product.category));
    }

    if (sortOption === "price-low") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-high") {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    } else if (sortOption === "newest") {
      filtered = [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredProducts(filtered);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setSelectedSize(""); // Reset size selection when opening modal
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h3" sx={{ fontWeight: 600, mb: 2 }}>Shop</Typography>
      <Typography variant="body1" sx={{ color: "gray", mb: 4 }}>
        Discover our latest collection of stylish and affordable fashion.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Filters</Typography>
          <Typography 
            variant="body2" 
            sx={{ color: "gray", cursor: "pointer", mb: 2 }} 
            onClick={() => {
              setFilters({ maleWear: false, womenWear: false, caps: false, shoes: false });
              applyFiltersAndSort({ maleWear: false, womenWear: false, caps: false, shoes: false }, sortBy);
            }}
          >
            Clear filters
          </Typography>

          <FormGroup>
            {Object.keys(filters).map((key) => (
              <FormControlLabel 
                key={key}
                control={<Checkbox checked={filters[key]} onChange={handleFilterChange} name={key} />} 
                label={key.charAt(0).toUpperCase() + key.slice(1)} 
              />
            ))}
          </FormGroup>
        </Grid>

        <Grid item xs={12} md={9}>
          <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Typography variant="body2">Showing {filteredProducts.length} Products</Typography>
            <Select value={sortBy} onChange={handleSortChange} size="small">
              <MenuItem value="popular">Popular</MenuItem>
              <MenuItem value="price-low">Price: Low to High</MenuItem>
              <MenuItem value="price-high">Price: High to Low</MenuItem>
              <MenuItem value="newest">Newest</MenuItem>
            </Select>
          </Box>

          <Grid container spacing={3}>
            {filteredProducts.map(product => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card sx={{ boxShadow: 2, cursor: "pointer" }} onClick={() => handleProductClick(product)}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image || "https://via.placeholder.com/200"}
                    alt={product.name}
                  />
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>{product.name}</Typography>
                    <Typography variant="body2" color="textSecondary">${product.price}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      {/* Modal */}
      <Modal open={Boolean(selectedProduct)} onClose={handleCloseModal} aria-labelledby="product-modal">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          {selectedProduct && (
            <>
              <CardMedia
                component="img"
                height="250"
                image={selectedProduct.image || "https://via.placeholder.com/250"}
                alt={selectedProduct.name}
                sx={{ borderRadius: 2 }}
              />
              <Typography variant="h5" sx={{ fontWeight: 600, mt: 2 }}>{selectedProduct.name}</Typography>
              <Typography variant="body2" sx={{ color: "gray", mt: 1 }}>{selectedProduct.description}</Typography>
              <Typography variant="h5" sx={{ fontWeight: 600, mt: 2 }}>${selectedProduct.price}</Typography>

              {/* Size Selection */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>Size</Typography>
                {["S", "M", "L"].map((size) => (
                  <Button 
                    key={size} 
                    variant={selectedSize === size ? "contained" : "outlined"}
                    onClick={() => setSelectedSize(size)}
                    sx={{ m: 0.5,
                      color: selectedSize === size ? "white" : "black",
                      backgroundColor: selectedSize === size ? "black" : "transparent",
                      borderColor: "black",
                      "&:hover": {
                        backgroundColor: "black",
                        color: "white",
                      },
                      }}
                  >
                    {size}
                  </Button>
                ))}
              </Box>

              {/* Quantity Selector */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
                <IconButton onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}><RemoveIcon /></IconButton>
                <Typography>{quantity}</Typography>
                <IconButton onClick={() => setQuantity((prev) => prev + 1)}><AddIcon /></IconButton>
              </Box>

              <Button variant="contained" sx={{ mt: 3, bgcolor: "black", color: "white" }} fullWidth>
                Add to Cart - ${selectedProduct.price * quantity}
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default Shop;
