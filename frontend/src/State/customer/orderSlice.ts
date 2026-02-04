import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Order, OrderItem, OrderState } from "../../types/orderTypes";
import { api } from "../../config/Api";
import { Address } from "../../types/userTypes";


const initialState: OrderState = {
    orders: [],
    orderItem: null,
    currentOrder: null,
    paymentOrder: null,
    loading: false,
    error: null,
    orderCancled: false,
};

const API_URL = '/api/orders'

export const fetchUserOrderHistory = createAsyncThunk<Order[], string>('orders/fetchUserOrderHistory',
    async (jwt, { rejectWithValue }) => {
        try {
            const response = await api.get(`${API_URL}/user`, {
                headers: {
                    Authorization: `Bearer ${jwt}`
                },
            });
            console.log("order history fetched ", response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.error || "Faild to fetch order history");
        }
    }
);

export const fetchOrderById = createAsyncThunk<Order, { orderId: number, jwt: string }>('orders/fetchOrderById',
    async ({ orderId, jwt }, { rejectWithValue }) => {
        try {
            const response = await api.get(`${API_URL}/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`
                },
            });
            console.log("order fetch ", response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.error || "Faild to fetch order");
        }
    }
);

export const createOrder = createAsyncThunk<any, { address: Address, jwt: string, paymentGateway: string }>('orders/createOrder',
    async ({ address, jwt, paymentGateway }, { rejectWithValue }) => {
        try {
            const response = await api.post(`${API_URL}`, address, {   // impl
                headers: { Authorization: `Bearer ${jwt}` },
                params: { paymentMethod: paymentGateway }
            });

            console.log("order created ", response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.error || "Faild to create Order");
        }
    }
);

export const fetchOrderItemById = createAsyncThunk<OrderItem, { orderItemId: number, jwt: string }>('orders/fetchOrderItemById',
    async ({ orderItemId, jwt }, { rejectWithValue }) => {
        try {
            const response = await api.get(`${API_URL}/item/${orderItemId}`, {
                headers: { Authorization: `Bearer ${jwt}` },
            });
            return response.data;
        } catch (error) {
            rejectWithValue(error.response.data.error || "Faild to create order");
        }
    }
);

export const paymentSuccess = createAsyncThunk<any, { paymentId: string, jwt: string, paymentLinkId: string }, { rejectValue: string }>(
    "orders/paymentSuccess", async ({ paymentId, jwt, paymentLinkId }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/api/payment/${paymentId}`, {   // impl
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
                params: { paymentLinkId },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.error || "Faild to process payment");
        }
    }
);

export const cancleOrder = createAsyncThunk<Order, any>('orders/cancleOrder',
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await api.put(`${API_URL}/${orderId}/cancel`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.error || "An error occurred while canclling the order.");
        }
    }
);

const orderSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {
        clearPaymentOrder: (state) => {
            state.paymentOrder = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUserOrderHistory.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.orderCancled = false;
        })
            .addCase(fetchUserOrderHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchUserOrderHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload  as string;
            });
        builder.addCase(fetchOrderById.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentOrder = action.payload;
            })
            .addCase(fetchOrderById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
        builder.addCase(createOrder.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.paymentOrder = action.payload;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
        builder.addCase(fetchOrderItemById.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchOrderItemById.fulfilled, (state, action) => {
                state.loading = false;
                state.orderItem = action.payload;
            })
            .addCase(fetchOrderItemById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
        builder.addCase(paymentSuccess.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(paymentSuccess.fulfilled, (state, action) => {
                state.loading = false;
                // Clear the payment order state after successful payment
                state.paymentOrder = null; 
                console.log("Payment successful ", action.payload);
            })
            .addCase(paymentSuccess.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
        builder.addCase(cancleOrder.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.orderCancled = false;
        })
            .addCase(cancleOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = state.orders.map((order) =>
                    order.id === action.payload.id ? action.payload : order
                );
                state.orderCancled = true;
                state.currentOrder = action.payload;
            })
            .addCase(cancleOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});
export const { clearPaymentOrder } = orderSlice.actions;
export default orderSlice.reducer;