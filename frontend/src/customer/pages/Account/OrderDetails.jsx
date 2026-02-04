
import { Box, Button, Divider } from '@mui/material';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import OrderStepper from './OrderStepper';
import { Payments } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../State/Store';
import { cancleOrder, fetchOrderById, fetchOrderItemById } from '../../../State/customer/orderSlice';
import CircularProgress from '@mui/material/CircularProgress';

const OrderDetails = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { orderId, orderItemId } = useParams();
    
    // **FIXED**: Correctly access slices from the Redux store
    const { order, auth } = useAppSelector(store => store);

    console.log("OrderDetails params - ", { orderId, orderItemId }, auth);

    useEffect(() => {
        if (orderId && auth.jwt) {
            console.log("Fetching order with ID : ", orderId);
            dispatch(fetchOrderById({ orderId: Number(orderId), jwt: auth.jwt }));
        }
    }, [orderId, auth.jwt, dispatch]);

    useEffect(() => {
        if (orderItemId && auth.jwt) {
            dispatch(fetchOrderItemById({ orderItemId: Number(orderItemId), jwt: auth.jwt }));
        }
    }, [orderItemId, auth.jwt, dispatch]);

    const handleCancel = () => {
        if (order.currentOrder?.id && auth.user) {
            dispatch(cancleOrder({ orderId: order.currentOrder.id, jwt: auth.jwt }));
        }
    };

    if (order.loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <CircularProgress />
            </div>
        );
    }

    if (!order.currentOrder || !order.orderItem) {
        return (
            <div className="flex justify-center items-center h-screen text-red-500">
                <p>Order not found or an error occurred.</p>
            </div>
        );
    }

    const isCanceled = order.currentOrder.orderStatus === "CANCELLED";
    
    return (
        <Box className='space-y-5 p-5 md:p-10 lg:p-20'>
            <section className="flex flex-col md:flex-row gap-5 items-center md:items-start justify-center text-center md:text-left">
                <img alt="" className="w-40 h-40 object-cover rounded-md" 
                src={order.orderItem?.product?.images?.[0] || 'https://placehold.co/160x160'} />
                
                <div className="text-sm space-y-1">
                    <h1 className="font-bold text-lg">{order.orderItem?.product?.seller?.businessDetails?.businessName}</h1>
                    <p>{order.orderItem?.product?.title}</p>
                    <p><strong>Size: </strong>{order.orderItem?.size}</p>
                    <p className="font-semibold text-xl">₹{order.orderItem?.sellingPrice}.00</p>
                    <div className="pt-2">
                        <Button variant='contained' onClick={() => navigate(`/reviews/${order.orderItem.product.id}/create`)}>Write Review</Button>
                    </div>
                </div>
            </section>

            <section className="border p-5 rounded-lg shadow-sm">
                <OrderStepper orderStatus={order.currentOrder.orderStatus} />
            </section>

            <div className="border p-5 rounded-lg shadow-sm">
                <h1 className="font-bold pb-3">Delivery Address</h1>
                <div className="text-sm space-y-2">
                    <div className="flex gap-5 font-medium">
                        <p>{order.currentOrder?.shippingAddress?.name}</p>
                        <Divider flexItem orientation='vertical'/>
                        <p>{order.currentOrder?.shippingAddress?.mobile}</p>
                    </div>
                    <p>
                        {order.currentOrder?.shippingAddress?.address}, {order.currentOrder?.shippingAddress?.state},{" "}
                        {order.currentOrder?.shippingAddress?.city}, {" - "}
                        {order.currentOrder?.shippingAddress?.pinCode},
                    </p>
                </div>
            </div>

            <div className="border space-y-4 rounded-lg shadow-sm">
                <div className="flex justify-between text-sm pt-5 px-5">
                    <div className="space-y-1">
                        <p>You saved <span className='text-green-500 font-medium text-xs'>₹{order.orderItem?.product?.mrpPrice - order.orderItem?.sellingPrice}.00</span> on this item</p>
                    </div>
                    <p className='font-medium'>₹{order.orderItem?.sellingPrice}.00</p>
                </div>
                <div className="px-5">
                    <div className="bg-teal-50 px-5 py-2 text-xs font-medium flex items-center gap-3 rounded-md">
                        <Payments/>
                        <p>Pay On Delivery</p>
                    </div>
                </div>

                <Divider/>
                <div className="px-5 pb-5">
                    <p className="text-xs"><strong>Sold by : </strong>{order.orderItem?.product?.seller?.businessDetails?.businessName}</p>
                </div>
                <div className="p-5">
                    <Button 
                        onClick={handleCancel}
                        disabled={isCanceled} 
                        color='error' 
                        sx={{ py: "0.7rem" }} 
                        variant='outlined' 
                        fullWidth
                    >
                        {isCanceled ? "Order Canceled" : "Cancel Order"}
                    </Button>
                </div>
            </div>
        </Box>
    );
};
export default OrderDetails;
