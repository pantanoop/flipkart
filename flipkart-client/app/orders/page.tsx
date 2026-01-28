"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  fetchSellerOrders,
  fetchUserOrders,
  fetchAllOrdersAdmin,
  cancelOrder,
} from "../redux/orderSlice";
import { Box, Button, Step, StepLabel, Stepper } from "@mui/material";
import "./Orders.css";

function Orders() {
  const dispatch = useDispatch<any>();
  const router = useRouter();

  const currentUser = useSelector((state: any) => state.authenticator.c_user);
  const {
    orders = [],
    loading,
    error,
  } = useSelector((state: any) => state.order);
  console.log(orders);
  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    } else if (currentUser.role === "customer") {
      dispatch(fetchUserOrders(currentUser.userid));
    } else if (currentUser.role === "seller") {
      dispatch(fetchSellerOrders(currentUser.userid));
    } else if (currentUser.role === "admin") {
      dispatch(fetchAllOrdersAdmin());
    }
  }, [currentUser]);

  const handleCancelOrder = (order: any) => {
    dispatch(
      cancelOrder({
        orderid: order.orderid,
        userid: order.userid,
      }),
    );
  };

  const getStepIndex = (status: string) => {
    switch (status) {
      case "ORDERED":
        return 0;
      case "SHIPPED":
        return 1;
      case "DISPATCHED":
        return 2;
      case "DELIVERED":
        return 3;
      default:
        return 0;
    }
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="orders">
      <h1>📦 Your Orders</h1>

      {orders?.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders?.map((order: any, orderIndex: number) => (
          <div
            className="order-card"
            key={order.orderid ?? `order-${orderIndex}`} // unique key
          >
            <Box sx={{ mb: 6 }}>
              <Stepper
                activeStep={getStepIndex(order.status)}
                alternativeLabel
                sx={{
                  "& .MuiStepLabel-root .Mui-completed": { color: "#1976D2" },
                  "& .MuiStepLabel-root .Mui-active": { color: "#1976D2" },
                }}
              >
                <Step>
                  <StepLabel>ORDERED</StepLabel>
                </Step>
                <Step>
                  <StepLabel>SHIPPED</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Dispatched</StepLabel>
                </Step>
                <Step>
                  <StepLabel>DELIVERED</StepLabel>
                </Step>
              </Stepper>
            </Box>
            <div className="order-header">
              <div>
                <strong>Order Id:</strong> {order.orderid ?? "N/A"}
              </div>
              <div>
                <strong>Status:</strong>{" "}
                <span
                  className={`status ${
                    order.status?.toLowerCase() ?? "unknown"
                  }`}
                >
                  {order.status ?? "UNKNOWN"}
                </span>
              </div>
              <div>
                <strong>Date:</strong>{" "}
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString()
                  : "N/A"}
              </div>

              {currentUser?.role === "admin" &&
                order.status !== "CANCELLED" && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleCancelOrder(order)}
                    style={{ marginTop: "10px" }}
                  >
                    Cancel Order
                  </Button>
                )}
            </div>

            <div className="order-items">
              {order.items?.length > 0 ? (
                order.items.map((item: any, itemIndex: number) => (
                  <div
                    className="order-item"
                    key={`${order.orderid}-${item.id ?? itemIndex}`}
                  >
                    <p>
                      <strong>Product Id:</strong> {item.productid ?? "N/A"}
                    </p>
                    <p>Qty: {item.quantity ?? 0}</p>
                    <p>Price: $ {item.priceAtPurchase?.toFixed(2) ?? "0.00"}</p>
                  </div>
                ))
              ) : (
                <p>No items in this order.</p>
              )}
            </div>

            <div className="order-footer">
              <h3>Total: $ {order.totalAmount?.toFixed(2) ?? "0.00"}</h3>
            </div>
          </div>
        ))
      )}

      <Button variant="outlined" onClick={() => router.push("/dashboard")}>
        Back to Home
      </Button>
    </div>
  );
}

export default Orders;
