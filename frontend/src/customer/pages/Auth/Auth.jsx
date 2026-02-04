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
        // This effect will now run whenever `auth.user` changes.
        // It will detect the successful login and the user's role.
        if (auth.user && auth.user.role === 'ROLE_ADMIN') {
            navigate('/admin');
        }
    }, [auth.user, navigate]); // Added auth.user to the dependency array

    return (
        <div className='flex justify-center h-[90vh] items-center'>
            <div className="max-w-md h-[85vh] rounded-md shadow-lg">
                <img className='w-full rounded-t-md' src='https://imgs.search.brave.com/pYrdFi0ie6VwUOdibjCGafUGcD-BZr0n-Ilm0o08qgc/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdDQuZGVwb3NpdHBob3Rvcy5jb20vMTExNDg3My8yNTgxNi9pLzQ1MC9kZXBvc2l0cGhvdG9zXzI1ODE2NzA5OC1zdG9jay1waG90by1ibHVyLWFic3RyYWN0LWJhY2tncm91bmQtY29sb3JmdWwtZ3JhZGllbnQuanBn' alt='' />
                <div className="mt-8 px-10">
                    {isLogin ? <LoginForm /> : <RegisterForm />}
                    <div className='flex items-center gap-1 justify-center mt-5'>
                        <p>{isLogin && "Don't "}have Account</p>
                        <Button size='small' onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? "Create Account" : "login"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;