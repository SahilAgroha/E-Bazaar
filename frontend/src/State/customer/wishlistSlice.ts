import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Wishlist, WishlistState } from "../../types/wishlistTypes";
import { api } from "../../config/Api";
import { number } from "yup";

// All Done  // impl

const initialState:WishlistState={
    wishlist: null,
    loading:false,
    error:null,
}
export const getWishlistByUserId=createAsyncThunk('wishlist/getWishlistByUserId',
    async(_,{rejectWithValue})=>{
        try {
            const response=await api.get(`/api/wishlist`,{    //impl
                headers:{
                    Authorization:`Bearer ${localStorage.getItem('jwt')}`
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data.message || "Faild to fetch wishlist");
        }
    }
);
export const addProductToWishlist=createAsyncThunk('wishlist/addProductToWishlist',
    async({productId}:{productId:number},{rejectWithValue})=>{
        try {
            const response = await api.post(`/api/wishlist/add-product/${productId}`,{ },{   // impl
                headers:{
                    Authorization:`Bearer ${localStorage.getItem('jwt')}`,
                }
            });
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data.message || "Faild to add product to wishlist");
        }
    }
);

const wishlistSlice=createSlice({
    name:"wishlist",
    initialState,
    reducers:{
        resetWishlistState:(state)=>{
            state.wishlist=null;
            state.loading=false;
            state.error=null;
        },
    },
    extraReducers:(builder)=>{
        builder.addCase(getWishlistByUserId.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(getWishlistByUserId.fulfilled,(state,action:PayloadAction<Wishlist>)=>{
            state.wishlist=action.payload;
            state.loading=false;
        })
        .addCase(getWishlistByUserId.rejected,(state,action:PayloadAction<any>)=>{
            state.loading=false;
            state.error=action.payload;
        });
        builder.addCase(addProductToWishlist.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(addProductToWishlist.fulfilled,(state,action:PayloadAction<Wishlist>)=>{
            state.wishlist=action.payload;
            state.loading=false;
        })
        .addCase(addProductToWishlist.rejected,(state,action:PayloadAction<any>)=>{
            state.loading=false;
            state.error=action.payload;
        });
    }
});

export const {resetWishlistState}=wishlistSlice.actions;

export default wishlistSlice.reducer;