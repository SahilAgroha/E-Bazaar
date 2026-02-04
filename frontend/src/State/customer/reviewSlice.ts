import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../config/Api";
import { Review, ReviewState } from "../../types/ReviewType";

const initialState: ReviewState = {
    reviews: [],
    loading: false,
    error: null,
    reviewUpdated: false,
    reviewCreated: false,
};

const API_URL = "/api";

export const fetchProductReviews = createAsyncThunk(
    'reviews/fetchProductReviews',
    async (productId: number, { rejectWithValue }) => {
        try {
            const response = await api.get(`${API_URL}/products/${productId}/reviews`,{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt') || ''}`,
                },
            });
            
            console.log('fetchProductReviews  - - - ', response.data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch reviews");
        }
    }
);

export const writeReview = createAsyncThunk(
    'reviews/writeReview',
    async ({ productId, reviewData, jwt }: { productId: number, reviewData: any, jwt: string }, { rejectWithValue }) => {
        try {
            const response = await api.post(`${API_URL}/products/${productId}/reviews`, reviewData, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log('writeReview - -- -', response.data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to submit review");
        }
    }
);

export const updateReview = createAsyncThunk(
    'reviews/updateReview',
    async ({ reviewId, reviewData, jwt }: { reviewId: number, reviewData: any, jwt: string }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`${API_URL}/reviews/${reviewId}`, reviewData, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log('updateReview', response.data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to update review");
        }
    }
);

export const deleteReview = createAsyncThunk(
    'reviews/deleteReview',
    async ({ reviewId, jwt }: { reviewId: number, jwt: string }, { rejectWithValue }) => {
        try {
            await api.delete(`${API_URL}/reviews/${reviewId}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log('deleteReview - -', reviewId);
            return reviewId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete review");
        }
    }
);

const reviewSlice = createSlice({
    name: 'reviews',
    initialState,
    reducers: {
        resetReviewState: (state) => {
            state.reviewCreated = false;
            state.reviewUpdated = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductReviews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductReviews.fulfilled, (state, action: PayloadAction<Review[]>) => {
                state.loading = false;
                state.reviews = action.payload;
            })
            .addCase(fetchProductReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(writeReview.pending, (state) => {
                state.loading = true;
                state.reviewCreated = false;
            })
            .addCase(writeReview.fulfilled, (state, action: PayloadAction<Review>) => {
                state.loading = false;
                state.reviewCreated = true;
                state.reviews.unshift(action.payload);
            })
            .addCase(writeReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.reviewCreated = false;
            })
            .addCase(updateReview.pending, (state) => {
                state.loading = true;
                state.reviewUpdated = false;
            })
            .addCase(updateReview.fulfilled, (state, action: PayloadAction<Review>) => {
                state.loading = false;
                state.reviewUpdated = true;
                const index = state.reviews.findIndex(r => r.id === action.payload.id);
                if (index !== -1) {
                    state.reviews[index] = action.payload;
                }
            })
            .addCase(updateReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.reviewUpdated = false;
            })
            .addCase(deleteReview.fulfilled, (state, action: PayloadAction<number>) => {
                state.reviews = state.reviews.filter(r => r.id !== action.payload);
            });
    },
});

export const { resetReviewState } = reviewSlice.actions;
export default reviewSlice.reducer;
