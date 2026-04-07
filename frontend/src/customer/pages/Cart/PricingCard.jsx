import { Divider } from '@mui/material'
import React from 'react'
import { sumCartItemSellingPrice } from '../../../Util/sumCartItemMrpPrice'

const PricingCard = ({cart}) => {
    const totalMrp = cart?.totalMrpPrice || 0;
    const totalSelling = cart?.totalSellingPrice || 0;
    const shipping = cart?.shipping || 0;
    const couponPercentage = cart?.discount || 0;
    console.log("Cart ==== ",cart);

    // Calculate sum of base selling price from items
    let baseSellingPrice = totalSelling;
    if (cart?.cartItems && cart.cartItems.length > 0) {
        baseSellingPrice = sumCartItemSellingPrice(cart.cartItems);
    }

    const productDiscountAmount = totalMrp - baseSellingPrice;
    const couponDiscountAmount = baseSellingPrice - totalSelling;

    // Final payable amount
    const finalPrice = totalSelling + shipping;

    return (
        <>
            <div className='space-y-3 p-5'>
                <div className='flex justify-between items-center'>
                    <span>Total MRP</span>
                    <span className='line-through text-gray-500'>₹{totalMrp}</span>
                </div>

                <div className='flex justify-between items-center'>
                    <span>Product Discount</span>
                    <span className='text-green-600'>-₹{productDiscountAmount}</span>
                </div>
                
                {cart?.couponCode && couponPercentage > 0 && (
                    <div className='flex justify-between items-center'>
                        <span>Coupon Discount ({couponPercentage}%)</span>
                        <span className='text-green-600'>-₹{couponDiscountAmount.toFixed(2)}</span>
                    </div>
                )}

                <div className='flex justify-between items-center'>
                    <span>Shipping</span>
                    <span>₹{shipping}</span>
                </div>

                <div className='flex justify-between items-center'>
                    <span>Platform Fee</span>
                    <span>Free</span>
                </div>
            </div>

            <Divider/>

            <div className='flex justify-between items-center p-5 text-[#00927c] font-semibold text-lg'>
                <span>Final Payable</span>
                <span>₹{finalPrice.toFixed(2)}</span>
            </div>
        </>
    );
};

export default PricingCard;