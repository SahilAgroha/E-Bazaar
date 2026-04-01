import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import Button from '@mui/material/Button';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();
    const { auth } = useSelector(store => store);

    useEffect(() => {
        if (!auth.user) return;

        if (auth.user.role === 'ROLE_ADMIN') {
            navigate('/admin');
        } else {
            // Customer or Seller → go to home
            navigate('/');
        }
    }, [auth.user]);

    return (
        <div className="flex justify-center h-screen items-center bg-gray-50 p-4">
            <div className="relative w-full max-w-4xl h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden flex">
                
                {/* Form Container (Left Side Base) */}
                <div className={`absolute top-0 left-0 h-full w-1/2 transition-transform duration-700 ease-in-out z-10 ${!isLogin ? 'translate-x-full' : 'translate-x-0'}`}>
                    
                    {/* Login Form Wrapper */}
                    <div className={`absolute inset-0 flex flex-col justify-center items-center p-8 bg-white transition-opacity duration-500 delay-200 ${!isLogin ? 'opacity-0 pointer-events-none' : 'opacity-100 z-20'}`}>
                        <div className="w-full max-w-sm">
                           <LoginForm />
                        </div>
                    </div>

                    {/* Signup Form Wrapper */}
                    <div className={`absolute inset-0 flex flex-col justify-center items-center p-8 bg-white transition-opacity duration-500 delay-200 ${isLogin ? 'opacity-0 pointer-events-none' : 'opacity-100 z-20'}`}>
                         <div className="w-full max-w-sm">
                           <RegisterForm />
                        </div>
                    </div>
                </div>

                {/* Overlay Panel Container (Sliding Part) */}
                <div className={`absolute top-0 left-1/2 w-1/2 h-full bg-primary-color overflow-hidden transition-transform duration-700 ease-in-out z-30 ${!isLogin ? '-translate-x-full' : 'translate-x-0'}`}>
                    
                    {/* Background Design */}
                    <div className="absolute inset-0 bg-linear-to-br from-primary-color to-[#004d41] opacity-90"></div>
                    <img className='absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30 select-none' src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop' alt='geometric background' />

                    {/* Overlay Content Wrapper */}
                    <div className="relative z-40 flex flex-col justify-center items-center h-full text-white text-center px-10">
                        
                        {/* Right Overlay Content (Shown during Login, asks to Sign Up) */}
                        <div className={`absolute inset-0 flex flex-col justify-center items-center px-10 transition-all duration-700 ease-in-out ${!isLogin ? 'translate-x-[20%] opacity-0 pointer-events-none' : 'translate-x-0 opacity-100 delay-150'}`}>
                            <h2 className="text-4xl font-bold mb-4 drop-shadow-md">Welcome, Friend!</h2>
                            <p className="mb-8 text-base font-light text-gray-100 leading-relaxed shadow-sm">Enter your personal details to kick off your journey.</p>
                            <button 
                                onClick={() => setIsLogin(false)}
                                className="border-2 border-white text-white rounded-full px-12 py-3 font-semibold uppercase tracking-wider hover:bg-white hover:text-primary-color transition-colors duration-300"
                            >
                                Sign Up
                            </button>
                        </div>

                        {/* Left Overlay Content (Shown during Signup, asks to Sign In) */}
                        <div className={`absolute inset-0 flex flex-col justify-center items-center px-10 transition-all duration-700 ease-in-out ${isLogin ? '-translate-x-[20%] opacity-0 pointer-events-none' : 'translate-x-0 opacity-100 delay-150'}`}>
                            <h2 className="text-4xl font-bold mb-4 drop-shadow-md">Welcome Back!</h2>
                            <p className="mb-8 text-base font-light text-gray-100 leading-relaxed shadow-sm">Already have an account? Login to access your dashboard.</p>
                            <button 
                                onClick={() => setIsLogin(true)}
                                className="border-2 border-white text-white rounded-full px-12 py-3 font-semibold uppercase tracking-wider hover:bg-white hover:text-primary-color transition-colors duration-300"
                            >
                                Sign In
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;