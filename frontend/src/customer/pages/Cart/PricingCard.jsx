import { Divider } from '@mui/material'
import React from 'react'

const PricingCard = ({cart}) => {
    const totalMrp = cart?.totalMrpPrice || 0;
    const totalSelling = cart?.totalSellingPrice || 0;
    const discountPercent = cart?.discount || 0;
    const shipping = cart?.shipping || 0;

    // Discount amount from percentage on selling price
    const discountAmount = (totalSelling * discountPercent) / 100;

    // Final payable amount
    const finalPrice = totalSelling - discountAmount + shipping;

    return (
        <>
            <div className='space-y-3 p-5'>
                <div className='flex justify-between items-center'>
                    <span>Total MRP</span>
                    <span className='line-through text-gray-500'>₹{totalMrp}</span>
                </div>

                <div className='flex justify-between items-center'>
                    <span>Total Selling Price</span>
                    <span>₹{totalSelling}</span>
                </div>

                <div className='flex justify-between items-center'>
                    <span>Coupon Discount ({discountPercent}%)</span>
                    <span className='text-red-600'>-₹{discountAmount}</span>
                </div>

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

            <div className='flex justify-between items-center p-5 text-[#00927c] font-semibold'>
                <span>Final Payable</span>
                <span>₹{finalPrice}</span>
            </div>
        </>
    );
};

export default PricingCard;