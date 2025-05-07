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
  CircularProgress,
} from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const ordersRef = collection(db, "users", user.uid, "orders");
        const ordersSnapshot = await getDocs(ordersRef);

        const fetchedOrders = ordersSnapshot.docs.map((doc) => {
          const data = doc.data();
          const createdAt =
            data.createdAt?.toDate?.() ||
            (data.createdAt?.seconds ? new Date(data.createdAt.seconds * 1000) : new Date());

          return {
            orderNo: data.orderNo || `ORD-${doc.id}`, // Using `doc.id` as a fallback for orderNo
            customerName: data.shippingInfo?.fullName || "Unknown Customer",
            paymentStatus: "Paid", // Assuming all are paid
            amount: data.subtotal || 0,
            paymentMethod: data.paymentMethod || "Unknown", // If available
            shippingAddress: data.shippingInfo
              ? `${data.shippingInfo.address}, ${data.shippingInfo.city} ${data.shippingInfo.zipCode}`
              : "No Address",
            orderDate: createdAt,
            status: data.status || "Processing",
          };
        });

        // Combine orders with the same `orderNo`
        const combinedOrders = fetchedOrders.reduce((acc, order) => {
          const existingOrder = acc.find(o => o.orderNo === order.orderNo);
          if (existingOrder) {
            // Merge details for the duplicate order
            existingOrder.amount += order.amount;
            // Here, you can also merge other properties if needed, for example:
            existingOrder.shippingAddress = order.shippingAddress;
            existingOrder.status = existingOrder.status === "Paid" ? "Paid" : order.status;
            existingOrder.orderDate = new Date(Math.min(existingOrder.orderDate, order.orderDate)); // Keep earliest order date
          } else {
            acc.push(order);
          }
          return acc;
        }, []);

        setOrders(combinedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <Box sx={{ padding: 4, bgcolor: "#f6f8fa", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        My Orders
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#fafafa" }}>
                <TableCell>ORDER NO.</TableCell>
                <TableCell>CUSTOMER NAME</TableCell>
                <TableCell>PAYMENT STATUS</TableCell>
                <TableCell>AMOUNT</TableCell>
                <TableCell>PAYMENT METHOD</TableCell>
                <TableCell>SHIPPING ADDRESS</TableCell>
                <TableCell>ORDER DATE</TableCell>
                <TableCell>STATUS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length > 0 ? (
                orders.map((order, index) => (
                  <TableRow key={index}>
                    <TableCell>{order.orderNo}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{order.paymentStatus}</TableCell>
                    <TableCell>₱{parseFloat(order.amount).toFixed(2)}</TableCell>
                    <TableCell>{order.paymentMethod}</TableCell>
                    <TableCell>{order.shippingAddress}</TableCell>
                    <TableCell>{order.orderDate.toLocaleDateString()}</TableCell>
                    <TableCell>{order.status}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default MyOrders;
