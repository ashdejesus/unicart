import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Container, Grid, Card, CardContent, Typography } from "@mui/material";

<<<<<<< HEAD

const Shop = () => {
  const [products, setProducts] = useState([]);


=======
const Shop = () => {
  const [products, setProducts] = useState([]);

>>>>>>> ed3ad7b8ecc18dfcb20f3691833fa5500de30c40
  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      setProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchProducts();
  }, []);

<<<<<<< HEAD

=======
>>>>>>> ed3ad7b8ecc18dfcb20f3691833fa5500de30c40
  return (
    <Container>
      <Typography variant="h4" sx={{ my: 4 }}>This Is Shop</Typography>
      <Grid container spacing={3}>
        {products.map(product => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography color="textSecondary">${product.price}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
<<<<<<< HEAD
   
  );
};


=======
    
  );
};

>>>>>>> ed3ad7b8ecc18dfcb20f3691833fa5500de30c40
export default Shop;
