import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box, CardMedia, Typography, Button, IconButton, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Dialog, DialogTitle, DialogContent, DialogActions, Tabs, Tab
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { doc, collection, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [openSizeGuide, setOpenSizeGuide] = useState(false);
  const [unit, setUnit] = useState("cm");
  const [tabIndex, setTabIndex] = useState(0);

  // Conversion function for cm to inches
  const cmToInches = (cm) => (cm * 0.393701).toFixed(1);

  const handleAddToCart = async (product) => {
    if (!product || !product.id || !product.name || !product.price) return;
    try {
      const user = auth.currentUser;
      if (!user) return;
      if (!selectedSize) return;

      const cartRef = collection(db, "users", user.uid, "carts");
      const itemRef = doc(cartRef, `${product.id}-${selectedSize}`);
      const itemSnap = await getDoc(itemRef);

      if (itemSnap.exists()) {
        await setDoc(itemRef, { quantity: itemSnap.data().quantity + quantity }, { merge: true });
      } else {
        await setDoc(itemRef, {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity,
          size: selectedSize,
          image: product.image || "",
          addedAt: new Date(),
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleTabChange = (_, newIndex) => setTabIndex(newIndex);

  if (!product) {
    return (
      <Box sx={{
        backgroundColor: "#eff2f6",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <Typography variant="h6" sx={{ color: "gray" }}>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#eff2f6", minHeight: "100vh", py: 4 }}>
      <Box sx={{ width: "90%", maxWidth: 1200, margin: "auto", mt: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Grid container spacing={1}>
              {product.images?.length > 0 ? product.images.map((imageUrl, index) => (
                <Grid item xs={6} key={index}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={imageUrl}
                    alt={product.name}
                    sx={{ borderRadius: 1, bgcolor: "#e0e0e0" }}
                  />
                </Grid>
              )) : [1, 2, 3, 4].map((_, index) => (
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

          <Grid item xs={12} md={6}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>{product.name}</Typography>
            <Typography variant="h6" sx={{ fontWeight: 500, mt: 1 }}>₱{product.price}</Typography>
            <Typography variant="body1" sx={{ color: "gray", mt: 1 }}>{product.description}</Typography>
            <Typography variant="body2" sx={{ mt: 2, fontWeight: 600 }}>by Vendor Name</Typography>

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
              Add to Cart - ₱{product.price * quantity}
            </Button>

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
              <Typography variant="body2">Free standard shipping</Typography>
              <Typography variant="body2" sx={{ textDecoration: "underline", cursor: "pointer" }}>
                Free Returns
              </Typography>
            </Box>

            <IconButton sx={{ mt: 2 }}>
              <FavoriteBorderIcon />
            </IconButton>

            <Button
              variant="text"
              sx={{ mt: 2, textTransform: "none" }}
              onClick={() => setOpenSizeGuide(true)}
            >
              Size Guide
            </Button>

            <Dialog
              open={openSizeGuide}
              onClose={() => setOpenSizeGuide(false)}
              maxWidth="sm"
              fullWidth
              sx={{
                "& .MuiDialog-paper": {
                  width: "90%",
                  maxWidth: "800px",
                },
              }}
            >
              <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
                Size Guide
              </DialogTitle>

              <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 2 }}>
                {["cm", "in"].map((option) => (
                  <Button
                    key={option}
                    variant={unit === option ? "contained" : "outlined"}
                    onClick={() => setUnit(option)}
                    sx={{
                      minWidth: 40, height: 40, borderRadius: "50%", padding: 0,
                      fontSize: "0.8rem",
                      backgroundColor: unit === option ? "black" : "transparent",
                      color: unit === option ? "white" : "black",
                      borderColor: "black",
                      "&:hover": { 
                        backgroundColor: "#767676", 
                        color: "white" 
                      },
                    }}
                  >
                    {option}
                  </Button>
                ))}
              </Box>

              <DialogContent>
                <Tabs
                  value={tabIndex}
                  onChange={handleTabChange}
                  TabIndicatorProps={{ style: { backgroundColor: "black" } }}
                  sx={{
                    "& .MuiTab-root": {
                      color: "#767676",
                      fontWeight: "bold",
                      textTransform: "none",
                    },
                    "& .MuiTab-root.Mui-selected": {
                      color: "black",
                    },
                  }}
                >
                  <Tab label="PRODUCT MEASUREMENTS" />
                  <Tab label="BODY MEASUREMENTS" />
                </Tabs>

                {tabIndex === 0 && (
                  <>
                    <TableContainer component={Paper} sx={{ mt: 3 }}>
                      <Table>
                        <TableHead>
                          <TableRow sx={{ backgroundColor: "#f6f7f7" }}>
                            {["Size", "Shoulder", "Length", "Sleeve Length", "Bust", "Cuff"].map((header) => (
                              <TableCell key={header} sx={{ fontWeight: "bold" }}>{header}</TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {[{ size: "S", shoulder: 44.5, length: 69, sleeve: 64.8, bust: 108, cuff: "24-31" }, { size: "M", shoulder: 46, length: 71, sleeve: 66, bust: 112, cuff: "25-32" }, { size: "L", shoulder: 47.8, length: 73, sleeve: 67.2, bust: 117, cuff: "26.2-33.2" }].map((row) => (
                            <TableRow key={row.size}>
                              <TableCell sx={{ backgroundColor: "#f6f7f7", fontWeight: "bold" }}>{row.size}</TableCell>
                              <TableCell>{unit === "cm" ? `${row.shoulder} cm` : `${cmToInches(row.shoulder)} in`}</TableCell>
                              <TableCell>{unit === "cm" ? `${row.length} cm` : `${cmToInches(row.length)} in`}</TableCell>
                              <TableCell>{unit === "cm" ? `${row.sleeve} cm` : `${cmToInches(row.sleeve)} in`}</TableCell>
                              <TableCell>{unit === "cm" ? `${row.bust} cm` : `${cmToInches(row.bust)} in`}</TableCell>
                              <TableCell>{row.cuff}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <Typography variant="caption" sx={{ mt: 1, display: "block", color: "gray" }}>
                      *This data was obtained from manually measuring the product, it may be off by 1-2 CM.
                    </Typography>
                  </>
                )}

                {tabIndex === 1 && (
                  <>
                    <TableContainer component={Paper} sx={{ mt: 3 }}>
                      <Table>
                        <TableHead>
                          <TableRow sx={{ backgroundColor: "#f6f7f7" }}>
                            {["Size", "Height", "Bust", "Waist", "Hip"].map((header) => (
                              <TableCell key={header} sx={{ fontWeight: "bold" }}>{header}</TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {[{ size: "S", height: "170-175", bust: "92-96", waist: "76-80", hip: "92-96" }, { size: "M", height: "175-180", bust: "96-100", waist: "80-84", hip: "96-100" }, { size: "L", height: "180-185", bust: "100-105", waist: "84-89", hip: "100-105" }].map((row) => (
                            <TableRow key={row.size}>
                              <TableCell sx={{ backgroundColor: "#f6f7f7", fontWeight: "bold" }}>{row.size}</TableCell>
                              <TableCell>
                                {unit === "cm" ? `${row.height} cm` :
                                  `${cmToInches(row.height.split("-")[0])}-${cmToInches(row.height.split("-")[1])} in`}
                              </TableCell>
                              <TableCell>
                                {unit === "cm" ? `${row.bust} cm` :
                                  `${cmToInches(row.bust.split("-")[0])}-${cmToInches(row.bust.split("-")[1])} in`}
                              </TableCell>
                              <TableCell>
                                {unit === "cm" ? `${row.waist} cm` :
                                  `${cmToInches(row.waist.split("-")[0])}-${cmToInches(row.waist.split("-")[1])} in`}
                              </TableCell>
                              <TableCell>
                                {unit === "cm" ? `${row.hip} cm` :
                                  `${cmToInches(row.hip.split("-")[0])}-${cmToInches(row.hip.split("-")[1])} in`}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <Typography variant="caption" sx={{ mt: 1, display: "block", color: "gray" }}>
                      *Depending on your body type and dressing habits, the above sizes are for reference only.
                    </Typography>
                  </>
                )}
              </DialogContent>

              <DialogActions>
                <Button
                  onClick={() => setOpenSizeGuide(false)}
                  color="primary"
                  sx={{
                    color: "black",
                    "&:hover": {
                      backgroundColor: "#e5e4e4",
                    },
                  }}
                >
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ProductPage;
