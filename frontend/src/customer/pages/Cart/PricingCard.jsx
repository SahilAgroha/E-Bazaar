import { Divider } from '@mui/material'
import React from 'react'

const PricingCard = ({cart}) => {
    // Safely destructure cart values, defaulting to 0 or null
    const subtotal = cart?.totalMrpPrice || 0;
    const discount = cart?.discount || 0;
    const shipping = cart?.shipping || 0;
    const total = cart?.totalSellingPrice || 0;

    console.log("PricingCard cart data: ", cart);

    return (
        <>
            <div className='space-y-3 p-5'>
                <div className='flex justify-between items-center'>
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                </div>
                <div className='flex justify-between items-center'>
                    <span>Discount</span>
                    <span>-₹{Math.abs(discount)}</span>
                </div>
                <div className='flex justify-between items-center'>
                    <span>Shipping</span>
                    <span>₹{shipping}</span>
                </div>
                <div className='flex justify-between items-center'>
                    <span>Platform</span>
                    <span>free</span>
                </div>
            </div>
            <Divider/>
            <div className='flex justify-between items-center p-5 text-[#00927c]'>
                <span>Total</span>
                <span>₹{total+discount}</span>
            </div>
        </>
    );
};

export default PricingCard;
