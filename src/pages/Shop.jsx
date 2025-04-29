import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { 
  Container, Grid, Card, CardContent, Typography, 
  CardMedia, FormGroup, FormControlLabel, Checkbox, 
  Select, MenuItem, Box, Button 
} from "@mui/material";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    "Oversized Jackets": false,
    "Techwear Jackets": false,
    "Cropped Jackets": false,
    "Vintage Jackets": false,
    "Streetwear Puffers": false,
    "Utility Jackets": false,
  });
  const [sortBy, setSortBy] = useState("popular");
  const [filterOpen, setFilterOpen] = useState(false);
  const navigate = useNavigate();

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

    // Get active filters (categories)
    const activeFilters = Object.keys(filterOptions).filter(key => filterOptions[key]);

    // Filter products by category if any filter is active
    if (activeFilters.length > 0) {
      filtered = products.filter(product => activeFilters.includes(product.category));
    }

    // Apply sorting
    if (sortOption === "price-low") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-high") {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    } else if (sortOption === "newest") {
      filtered = [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredProducts(filtered);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <Box sx={{ backgroundColor: "#eff2f6", minHeight: "100vh" }}>
      <Container sx={{ py: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 600, mb: 2 }}>Shop</Typography>
        <Typography variant="body1" sx={{ color: "gray", mb: 4 }}>
          Discover our latest collection of stylish and affordable fashion.
        </Typography>

        <Grid container spacing={3}>
  {/* Filter Section */}
  <Grid
    item
    xs={12} // Full width on mobile
    sm={3} // Sidebar on tablets and larger screens
    sx={{
      display: "block", // Always display the filter section
    }}
  >
    {/* Responsive Design for Mobile */}
    <Box
      sx={{
        display: { xs: "block", sm: "none" }, // Collapsible for mobile
        mb: 2,
      }}
    >
      <Button
  variant="outlined"
  fullWidth
  onClick={() => setFilterOpen((prev) => !prev)}
  sx={{
    textTransform: "none",
    mb: 2,
    color: "#000", // Inherit text color
    borderColor: "#c0c1c0", // Inherit border color
    "&:hover": {
      borderColor: "#E5E4E4", // Match hover border color
      backgroundColor: "#E5E4E4", // Match hover background color
    },
    "&:focus, &:active": {
      outline: "none",
      boxShadow: "none", // Remove focus ring
      borderColor: "#c0c1c0", // Keep border color unchanged
    },
  }}
>
  {filterOpen ? "Hide Filters" : "Show Filters"}
</Button>
      {filterOpen && (
        <Box
          sx={{
            backgroundColor: "#eff2f6",
            p: 2,
            borderRadius: "8px",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Filters
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "gray", cursor: "pointer", mb: 2 }}
            onClick={() => {
              const resetFilters = Object.keys(filters).reduce((acc, key) => {
                acc[key] = false;
                return acc;
              }, {});
              setFilters(resetFilters);
              applyFiltersAndSort(resetFilters, sortBy);
            }}
          >
            Clear filters
          </Typography>
          <FormGroup>
            {Object.keys(filters).map((key) => (
              <FormControlLabel
                key={key}
                control={
                  <Checkbox
                    checked={filters[key]}
                    onChange={handleFilterChange}
                    name={key}
                  />
                }
                label={key.charAt(0).toUpperCase() + key.slice(1)}
              />
            ))}
          </FormGroup>
        </Box>
      )}
    </Box>

    {/* Sidebar for Tablets and Larger Screens */}
    <Box
      sx={{
        display: { xs: "none", sm: "block" }, // Sidebar for larger screens
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        Filters
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: "gray", cursor: "pointer", mb: 2 }}
        onClick={() => {
          const resetFilters = Object.keys(filters).reduce((acc, key) => {
            acc[key] = false;
            return acc;
          }, {});
          setFilters(resetFilters);
          applyFiltersAndSort(resetFilters, sortBy);
        }}
      >
        Clear filters
      </Typography>
      <FormGroup>
        {Object.keys(filters).map((key) => (
          <FormControlLabel
            key={key}
            control={
              <Checkbox
                checked={filters[key]}
                onChange={handleFilterChange}
                name={key}
              />
            }
            label={key.charAt(0).toUpperCase() + key.slice(1)}
          />
        ))}
      </FormGroup>
    </Box>
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
        <Grid item xs={6} sm={6} md={4} key={product.id}> {/* Adjusted xs to 6 for two columns on mobile */}
         <Card
  sx={{
    boxShadow: 2,
    cursor: "pointer",
    backgroundColor: "#eff2f6", // Match the background color
    borderRadius: 2, // Add rounded corners for a modern look
    display: "flex", // Ensure consistent layout
    flexDirection: "column", // Stack content vertically
    height: "100%", // Ensure all cards are the same height
    "&:hover": {
      boxShadow: 4, // Slightly increase shadow on hover for interactivity
    },
  }}
  onClick={() => handleProductClick(product.id)}
>
  <CardMedia
    component="img"
    height="200"
    image={product.image || "https://via.placeholder.com/200"}
    alt={product.name}
  />
  <CardContent sx={{ flexGrow: 1 }}> {/* Ensures content stretches evenly */}
    <Typography variant="h6" sx={{ fontWeight: 600 }}>{product.name}</Typography>
    <Typography variant="body2" color="textSecondary">₱{product.price}</Typography>
  </CardContent>
</Card>
        </Grid>
      ))}
    </Grid>
  </Grid>
</Grid>
      </Container>
    </Box>
  );
};

export default Shop;