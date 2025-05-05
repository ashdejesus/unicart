import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const OrderConfirmation = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        px: 3,
      }}
    >
      <CheckCircleOutlineIcon sx={{ fontSize: 80, color: "green", mb: 2 }} />
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Thank you for your order!
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        We’ve received your payment and your jacket(s) will be shipped soon.
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        You’ll get an email confirmation with tracking info once your order ships.
      </Typography>
      <Button variant="contained" sx={{ bgcolor: "black" }} onClick={() => navigate("/")}>
        Back to Home
      </Button>
    </Box>
  );
};

export default OrderConfirmation;
