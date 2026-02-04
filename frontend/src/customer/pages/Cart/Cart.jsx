import React, { useState, useEffect } from 'react'
import { Close, LocalOffer } from '@mui/icons-material'
import { teal } from '@mui/material/colors'
import { Button, IconButton, TextField, CircularProgress, Typography } from '@mui/material'
import PricingCard from './PricingCard'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../State/Store'
import { fetchUserCart } from "../../../State/customer/cartSlice"
import CartItemCard from './CartItemCard'
import { applyCoupon } from '../../../State/customer/couponSlice'

const Cart = () => {
    const [couponCode, setCouponCode] = useState('');
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { cart, loading } = useAppSelector(store => store);
    const { coupon } = useAppSelector(store => store.coupon);
    const jwt = localStorage.getItem("jwt") || "";
    console.log("coupon  ", coupon);
    

    useEffect(() => {
        dispatch(fetchUserCart(jwt));
    }, [dispatch, jwt]);

    const handleApplyCoupon = () => {
      console.log("handleApplyCoupon called with code: ", couponCode);
      console.log("Current cart total: ", cart?.cart?.totalSellingPrice);
        if (couponCode && cart?.cart?.totalSellingPrice) {
            dispatch(applyCoupon({
                apply: "true",
                code: couponCode,
                orderValue: cart.cart.totalSellingPrice,
                jwt,
            }));
        }
    };

    const handleRemoveCoupon = () => {
      if (coupon?.cart?.coupon?.code) {
          dispatch(applyCoupon({
              apply: "false",
              code: coupon.cart.coupon.code,
              orderValue: 0, // Order value is not needed for removal but must be passed
              jwt,
          }));
      }
    };

    const handleBuyNow = () => {
        if (cart?.cart?.totalSellingPrice> cart?.cart?.discount) {
            navigate("/checkout");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <CircularProgress />
            </div>
        );
    }

    return (
        <div className='pt-10 px-5 sm:px-10 md:px-60 min-h-screen'>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-5'>
                <div className='cartItemSection lg:col-span-2 space-y-3'>
                    {cart.cart?.cartItems.map((item, index) => <CartItemCard key={index} item={item} />)}
                </div>
                <div className='col-span-1 text-sm space-y-3'>
                    <div className='border rounded-md px-5 py-3 space-y-5'>
                        <div className='flex gap-3 text-sm items-center'>
                            <div className='flex gap-3 text-sm items-center'>
                                <LocalOffer sx={{ color: teal[600], fontSize: "17px" }} />
                            </div>
                            <span>Apply Now</span>
                        </div>
                        {coupon?.couponApplied ? (
                            <div className='flex justify-center items-center'>
                                <TextField
                                    id='outlined-basic'
                                    placeholder='coupon code'
                                    size='small'
                                    variant='outlined'
                                    value={coupon?.cart?.coupon?.code}
                                    disabled
                                />
                                <Button size='small' onClick={handleRemoveCoupon}>
                                    Remove
                                </Button>
                            </div>
                        ) : (
                            <div className='flex justify-center items-center'>
                                <TextField
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    id='outlined-basic'
                                    placeholder='coupon code'
                                    size='small'
                                    variant='outlined'
                                    value={couponCode}
                                />
                                <Button size='small' onClick={handleApplyCoupon}>
                                    Apply
                                </Button>
                            </div>
                        )}
                        {/* Correctly check for the coupon error and display the message */}
                        {coupon && coupon.error && <Typography variant='body2' color='error'>{coupon.error}</Typography>}
                    </div>
                    <div className='border rounded-md'>
                        <PricingCard cart={cart.cart}/>
                        <div className='p-5'>
                            <Button variant='contained' fullWidth sx={{ py: "11px" }} onClick={handleBuyNow}>Buy Now</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
