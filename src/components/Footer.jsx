import React from "react";
import { Box, Typography, Grid, TextField, Button, Divider } from "@mui/material";

const Footer = () => {
  return (
    <>
     

      {/* Footer */}
      <Box sx={{ width: "100vw", backgroundColor: "#eff2f6", py: 10, px: 3 }}>
         {/* Divider */}
      <Divider sx={{ my: 5 }} />
        <Grid container spacing={4} alignItems="center">
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

          {/* Right Side: Links */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              {["Company", "Support", "More"].map((title, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>{title}</Typography>
                  {["About Us", "Careers", "Blog", "Contact", "FAQs"].map((text, i) => (
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
          COPYRIGHT © {new Date().getFullYear()} SITE.COM. ALL RIGHTS RESERVED
        </Typography>
      </Box>
    </>
  );
};

export default Footer;
