import { useFormik } from 'formik';
import React, { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../State/Store';
import { Button, CircularProgress, TextField, Snackbar, Alert } from '@mui/material';
import { sendLoginSignupOtp, signin } from '../../../State/AuthSlice';

const LoginForm = () => {
    const dispatch=useAppDispatch();
    const {auth}=useAppSelector(store=>store);

    const [snackbarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {
      if (auth.error) {
        setSnackbarOpen(true);
      }
    }, [auth.error]);

    const handleCloseSnackbar = () => {
      setSnackbarOpen(false);
    };

    const formik=useFormik({
      initialValues:{
        email:"",
        otp:"",
      },
      onSubmit:(values)=>{
        console.log("form data ",values)
        dispatch(signin(values));
      }
    })

    const handleSendOtp=()=>{
        dispatch(sendLoginSignupOtp({email:formik.values.email}))
      }

  return (
    <div>
      <h1 className="text-center font-bold text-xl text-primary-color pb-8">Login</h1>
      <div className="space-y-5">
        <TextField fullWidth name='email' label="Email"
        onChange={formik.handleChange} onBlur={formik.handleBlur} 
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}/>
        
        {auth.otpSent && <div className='space-y-3'>
          <p className='font-medium text-sm opacity-60'>Enter OTP sent to your email</p>
          <TextField fullWidth name='otp' label="OTP"
            onChange={formik.handleChange} onBlur={formik.handleBlur} 
            error={formik.touched.otp && Boolean(formik.errors.otp)}
            helperText={formik.touched.otp && formik.errors.otp}/>
          </div>}
          {!auth.otpSent?<Button onClick={handleSendOtp} variant='contained' fullWidth sx={{py:"11px"}}>
            {auth.loading?<CircularProgress/>:"Send OTP"}
          </Button> :
          <Button onClick={()=>formik.handleSubmit()} variant='contained' fullWidth sx={{py:"11px"}}>
            Login
          </Button> }
      </div>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity="error" variant="filled" sx={{ width: '100%', fontWeight: 'bold' }}>
          {auth.error}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default LoginForm
