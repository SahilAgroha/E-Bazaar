import { Box, Button, Divider } from "@mui/material";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { Payments } from "@mui/icons-material";

import OrderStepper from "./OrderStepper";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import {
  cancelOrder,
  fetchOrderById,
  fetchOrderItemById,
} from "../../../State/customer/orderSlice";

const OrderDetails = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { orderId, orderItemId } = useParams();
//   console.log("Order ID:", orderId, "Order Item ID:", orderItemId);

  const { currentOrder, orderItem, loading } = useAppSelector(
    (state) => state.order
  );
//   const { jwt } = useAppSelector((state) => state.auth);
    const jwt = localStorage.getItem("jwt");

  // ✅ Fetch Order
  useEffect(() => {
    if (orderId && jwt) {
      dispatch(fetchOrderById({ orderId: Number(orderId), jwt }));
    }
  }, [orderId, jwt, dispatch]);

  // ✅ Fetch Order Item
  useEffect(() => {
    if (orderItemId && jwt) {
      dispatch(fetchOrderItemById({ orderItemId: Number(orderItemId), jwt }));
    }
  }, [orderItemId, jwt, dispatch]);

  // ✅ Cancel Order
  const handleCancel = () => {
    if (currentOrder?.id && jwt) {
      dispatch(cancelOrder({ orderId: currentOrder.id, jwt }));
    }
  };

  // ✅ Loading Screen
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  // ✅ Safety check
  if (!currentOrder || !orderItem) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-xl font-semibold">
        Order not found.
      </div>
    );
  }
  

  const isCanceled = currentOrder.orderStatus === "CANCELLED";

  return (
    <Box className="space-y-5 p-5 md:p-10 lg:p-20">
      
      {/* ===== PRODUCT INFO ===== */}
      <section className="flex flex-col md:flex-row gap-5 items-center md:items-start justify-center text-center md:text-left border p-5 rounded-lg shadow-sm">
        <img
          alt=""
          className="w-40 h-40 object-cover rounded-md border"
          src={
            orderItem?.product?.images?.[0] ||
            "https://placehold.co/160x160"
          }
        />

        <div className="text-sm space-y-2">
          <h1 className="font-bold text-lg">
            {orderItem?.product?.seller?.businessDetails?.businessName}
          </h1>

          <p className="text-gray-600">{orderItem?.product?.title}</p>

          <p>
            <strong>Size: </strong>
            {orderItem?.size}
          </p>

          <p className="font-semibold text-xl text-[#00927c]">
            ₹{orderItem?.sellingPrice}
          </p>

          <div className="pt-2">
            <Button
              variant="contained"
              onClick={() =>
                navigate(`/reviews/${orderItem.product.id}/create`)
              }
            >
              Write Review
            </Button>
          </div>
        </div>
      </section>

      {/* ===== ORDER STATUS ===== */}
      <section className="border p-5 rounded-lg shadow-sm">
        <OrderStepper orderStatus={currentOrder.orderStatus} />
      </section>

      {/* ===== DELIVERY ADDRESS ===== */}
      <section className="border p-5 rounded-lg shadow-sm">
        <h1 className="font-bold pb-3">Delivery Address</h1>

        <div className="text-sm space-y-2">
          <div className="flex gap-5 font-medium">
            <p>{currentOrder.shippingAddress?.name}</p>
            <Divider flexItem orientation="vertical" />
            <p>{currentOrder.shippingAddress?.mobile}</p>
          </div>

          <p>
            {currentOrder.shippingAddress?.address},{" "}
            {currentOrder.shippingAddress?.locality},{" "}
            {currentOrder.shippingAddress?.city},{" "}
            {currentOrder.shippingAddress?.state} -{" "}
            {currentOrder.shippingAddress?.pinCode}
          </p>
        </div>
      </section>

      {/* ===== PRICE DETAILS ===== */}
      <section className="border rounded-lg shadow-sm">
        <div className="flex justify-between text-sm pt-5 px-5">
          <p>
            You saved{" "}
            <span className="text-green-600 font-medium">
              ₹{orderItem.product.mrpPrice - orderItem.sellingPrice}
            </span>{" "}
            on this item
          </p>

          <p className="font-semibold">₹{orderItem.sellingPrice}</p>
        </div>

        <div className="px-5 py-4">
          <div className="bg-teal-50 px-5 py-2 text-xs font-medium flex items-center gap-3 rounded-md">
            <Payments />
            <p>Pay On Delivery</p>
          </div>
        </div>

        <Divider />

        <div className="px-5 py-4 text-xs">
          <strong>Sold by : </strong>
          {orderItem?.product?.seller?.businessDetails?.businessName}
        </div>

        {/* ===== CANCEL BUTTON ===== */}
        <div className="p-5">
          <Button
            onClick={handleCancel}
            disabled={isCanceled}
            color="error"
            variant="outlined"
            fullWidth
            sx={{ py: "0.8rem" }}
          >
            {isCanceled ? "Order Cancelled" : "Cancel Order"}
          </Button>
        </div>
      </section>
    </Box>
  );
};

export default OrderDetails;