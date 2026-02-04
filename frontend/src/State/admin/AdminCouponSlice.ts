import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from '../../config/Api';
import { Cart } from "../../types/cartType"; // Assuming cartType.ts exists
import { Coupon, CouponState } from "../../types/couponTypes";

const initialState: CouponState = {
    coupons: [],
    cart: null,
    loading: false,
    error: null,
    couponCreated: false,
    couponApplied: false,
};

const API_URL = '/api/coupons';

export const createCoupon = createAsyncThunk(
    'coupon/createCoupon',
    async ({ coupon, jwt }: { coupon: any, jwt: string }, { rejectWithValue }) => {
        try {
            const response = await api.post(`${API_URL}/admin/create`, coupon, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log("createCoupon ", response.data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to create coupon");
        }
    }
);

export const deleteCoupon = createAsyncThunk(
    'coupon/deleteCoupon',
    async ({ id, jwt }: { id: number, jwt: string }, { rejectWithValue }) => {
        try {
            const response = await api.delete(`${API_URL}/admin/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log("deleteCoupon ", response.data);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete coupon");
        }
    }
);

export const getAllCoupons = createAsyncThunk(
    'coupon/getAllCoupons',
    async ({ jwt }: { jwt: string }, { rejectWithValue }) => {
        try {
            const response = await api.get(`${API_URL}/admin/all`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log("getAllCoupons ", response.data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch coupons");
        }
    }
);


export const removeCoupon = createAsyncThunk(
    'coupon/removeCoupon',
    async ({ code, jwt }: { code: string, jwt: string }, { rejectWithValue }) => {
        try {
            const response = await api.post(`${API_URL}/apply?apply=false&code=${code}`, null, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log("removeCoupon ", response.data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to remove coupon");
        }
    }
);

const couponSlice = createSlice({
    name: "coupon",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createCoupon.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.couponCreated = false;
            })
            .addCase(createCoupon.fulfilled, (state, action: PayloadAction<Coupon>) => {
                state.loading = false;
                state.coupons.push(action.payload);
                state.couponCreated = true;
            })
            // **FIX**: Removed PayloadAction generic from rejected cases
            .addCase(createCoupon.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.couponCreated = false;
            })
            .addCase(deleteCoupon.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCoupon.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.coupons = state.coupons.filter(coupon => coupon.id !== action.payload);
            })
            // **FIX**: Removed PayloadAction generic from rejected cases
            .addCase(deleteCoupon.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(getAllCoupons.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllCoupons.fulfilled, (state, action: PayloadAction<Coupon[]>) => {
                state.loading = false;
                state.coupons = action.payload;
            })
            // **FIX**: Removed PayloadAction generic from rejected cases
            .addCase(getAllCoupons.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(removeCoupon.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeCoupon.fulfilled, (state, action: PayloadAction<Cart>) => {
                state.loading = false;
                state.cart = action.payload;
                state.couponApplied = false;
            })
            // **FIX**: Removed PayloadAction generic from rejected cases
            .addCase(removeCoupon.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default couponSlice.reducer;
