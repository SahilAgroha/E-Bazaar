import React, { useState, useEffect } from 'react'
import SellerAccountForm from './SellerAccountForm';
import SellerLoginForm from './SellerLoginForm';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../State/Store';

const BecomeSeller = () => {
    const [isLogin,setIsLogin]=useState(false)
    const navigate = useNavigate();
    const { seller } = useAppSelector(store => store.sellerAuth);

    useEffect(() => {
        // 'seller' is null on page load — only set after a real sellerLogin call.
        // 'jwt' cannot be used here because sellerAuth initializes jwt from
        // localStorage which may hold a customer token.
        if (seller) {
            navigate('/seller');
        }
    }, [seller]);

    const handleShowPage=()=>{
        setIsLogin(!isLogin);
    }
    return (
        <div className="flex justify-center min-h-[calc(100vh-80px)] items-center bg-gray-50 p-4">
            <div className="relative w-full max-w-6xl h-[700px] bg-white rounded-2xl shadow-2xl overflow-hidden flex">
            
            {/* Left Side Container (Login Form) */}
            <div className="w-1/2 h-full overflow-y-auto bg-white custom-scrollbar">
                <div className="min-h-full flex flex-col justify-center items-center p-10">
                    <div className="w-full max-w-md">
                        <SellerLoginForm />
                    </div>
                </div>
            </div>

            {/* Right Side Container (Register Form) */}
            <div className="w-1/2 h-full overflow-y-auto bg-white custom-scrollbar">
                <div className="min-h-full flex flex-col justify-center p-10 mt-10">
                    <div className="w-full">
                        <SellerAccountForm />
                    </div>
                </div>
            </div>

            {/* The Animated Overlay Panel */}
            {/* isLogin = true -> Overlay moves RIGHT (translate-x-full) revealing Login on LEFT */}
            {/* isLogin = false -> Overlay stays LEFT (translate-x-0) revealing Register on RIGHT */}
            <div className={`absolute top-0 left-0 w-1/2 h-full bg-primary-color z-30 transition-transform duration-700 ease-in-out shadow-2xl ${isLogin ? 'translate-x-full' : 'translate-x-0'}`}>
                
                {/* Visual Background */}
                <div className="absolute inset-0 bg-linear-to-br from-[#0f172a] to-primary-color opacity-95"></div>
                <img className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30 select-none" src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2548&auto=format&fit=crop" alt="abstract tech" />

                {/* Content Inside Overlay */}
                <div className="relative z-40 flex flex-col justify-center items-center h-full text-white text-center px-12">
                    
                    {/* Register Overlay View (When isLogin=true, it sits on right side, asks user to Create Account instead) */}
                    <div className={`absolute inset-0 flex flex-col justify-center items-center px-12 transition-all duration-700 ease-in-out ${isLogin ? 'translate-x-0 opacity-100 delay-150' : 'translate-x-[20%] opacity-0 pointer-events-none'}`}>
                        <h2 className="text-4xl font-bold mb-4 drop-shadow-md">New Here?</h2>
                        <p className="mb-8 text-base font-light text-gray-200 leading-relaxed shadow-sm">Join the marketplace revolution and boost your sales by opening a seller account today.</p>
                        <button 
                            onClick={handleShowPage}
                            className="border-2 border-white text-white rounded-full px-12 py-3 font-semibold uppercase tracking-wider hover:bg-white hover:text-primary-color transition-colors duration-300"
                        >
                            Register
                        </button>
                    </div>

                    {/* Login Overlay View (When isLogin=false, it sits on left side, asks user to Login instead) */}
                    <div className={`absolute inset-0 flex flex-col justify-center items-center px-12 transition-all duration-700 ease-in-out ${!isLogin ? 'translate-x-0 opacity-100 delay-150' : '-translate-x-[20%] opacity-0 pointer-events-none'}`}>
                        <h2 className="text-4xl font-bold mb-4 drop-shadow-md">Welcome Back!</h2>
                        <p className="mb-8 text-base font-light text-gray-200 leading-relaxed shadow-sm">Already a seller? Log in to your dashboard to manage products, track orders, and grow.</p>
                        <button 
                            onClick={handleShowPage}
                            className="border-2 border-white text-white rounded-full px-12 py-3 font-semibold uppercase tracking-wider hover:bg-white hover:text-primary-color transition-colors duration-300"
                        >
                            Login
                        </button>
                    </div>

                </div>
            </div>
            
            </div>
        </div>
    );
}

export default BecomeSeller
