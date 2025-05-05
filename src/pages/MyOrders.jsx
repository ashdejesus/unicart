import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
} from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("7");

  useEffect(() => {
    const fetchOrders = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const ordersRef = collection(db, "users", user.uid, "orders");
      const snapshot = await getDocs(ordersRef);
      const data = snapshot.docs.map(doc => doc.data());
      setOrders(data);
    };

    fetchOrders();
  }, []);

  return (
    <Box sx={{ padding: 4, bgcolor: "#f6f8fa", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        my orders
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Select
          size="small"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          sx={{ bgcolor: "white", border: "1px solid #ccc" }}
        >
          <MenuItem value="7">Last 7 Days</MenuItem>
          <MenuItem value="30">Last 30 Days</MenuItem>
          <MenuItem value="all">All Time</MenuItem>
        </Select>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#fafafa" }}>
              <TableCell>ORDER NO.</TableCell>
              <TableCell>CUSTOMER NAME</TableCell>
              <TableCell>PAYMENT STATUS</TableCell>
              <TableCell>AMOUNT</TableCell>
              <TableCell>ADDRESS</TableCell>
              <TableCell>ORDER DATE</TableCell>
              <TableCell>STATUS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order, index) => (
              <TableRow key={index}>
                <TableCell>{order.orderNo}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.paymentStatus}</TableCell>
                <TableCell>${order.amount}</TableCell>
                <TableCell>{order.address}</TableCell>
                <TableCell>{order.orderDate}</TableCell>
                <TableCell>{order.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MyOrders;
