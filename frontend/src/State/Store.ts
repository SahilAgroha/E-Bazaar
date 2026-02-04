import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { thunk } from "redux-thunk";
import { TypedUseSelectorHook } from "react-redux";
import sellerSlice from "./seller/sellerSlice";
import sellerProductSlice from './seller/sellerProductSlice';
import productSlice from './customer/ProductSlice'
import authSlice from './AuthSlice'
import cartSlice from './customer/cartSlice'
import orderSlice from './customer/orderSlice'
import wishlistSlice from './customer/wishlistSlice'
import sellerOrderSlice from './seller/sellerOrderSlice'
import transactionSlice from './seller/transactionSlice'
import adminSlice from "./admin/adminSlice"
import customerSlice from './customer/customerSlice'
import dealSlice from './admin/DealSlice'
import sellerAuthSlice from "./seller/sellerAuthSlice";
import couponSlice from './admin/AdminCouponSlice';
import reviewsSlice from "./customer/reviewSlice";

const rootReducer=combineReducers({
    seller:sellerSlice,
    sellerProduct:sellerProductSlice,
    product:productSlice,
    auth:authSlice,
    cart:cartSlice,
    order:orderSlice,
    wishlist:wishlistSlice,
    customer:customerSlice,

    sellerOrder:sellerOrderSlice,
    transactions:transactionSlice,
    reviews: reviewsSlice,

    admin:adminSlice,
    deal:dealSlice,
    coupon: couponSlice, 

    sellerAuth:sellerAuthSlice,
})

const store=configureStore({
    reducer:rootReducer,
    // middleware:(getDefaultMiddleware)=>getDefaultMiddleware().concat(thunk)
})

export type AppDispatch=typeof store.dispatch;
export type RootState=ReturnType<typeof rootReducer>;

export const useAppDispatch=()=>useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;