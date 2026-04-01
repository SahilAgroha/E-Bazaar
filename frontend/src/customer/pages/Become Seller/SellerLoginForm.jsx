import { Button, TextField, CircularProgress, Snackbar, Alert } from '@mui/material'
import { useFormik } from 'formik'
import React, { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../State/Store'
import { sendLoginSignupOtp } from '../../../State/AuthSlice'
import { sellerLogin } from '../../../State/seller/sellerAuthSlice'

const SellerLoginForm = () => {
  const dispatch = useAppDispatch();
  const [otpSent, setOtpSent] = useState(false);
  const { auth, sellerAuth } = useAppSelector(store => store);

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    if (sellerAuth.error) {
      setSnackbarOpen(true);
    }
  }, [sellerAuth.error]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      otp: "",
    },
    onSubmit: (values) => {
      console.log("form data ", values)
      dispatch(sellerLogin({ email: values.email, otp: values.otp }))
    }
  })

  const handleSendOtp = () => {
    if (formik.values.email) {
      dispatch(sendLoginSignupOtp({ email: formik.values.email }))
      setOtpSent(true);
    }
  }

  return (
    <div className="w-full">
      <div className="text-center mb-10">
        <h1 className="font-bold text-3xl text-gray-800 mb-2">Seller Login</h1>
        <p className="text-gray-500 text-sm">Enter your credentials to access your dashboard</p>
      </div>
      
      <div className="space-y-6">
        <TextField 
          fullWidth 
          name="email" 
          label="Email Address"
          variant="outlined"
          onChange={formik.handleChange} 
          onBlur={formik.handleBlur} 
          value={formik.values.email}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        
        {otpSent && (
          <div className="space-y-4 animate-fade-in transition-all duration-300">
            <p className="font-medium text-sm text-primary-color flex items-center gap-2">
              <span className="text-lg">✉️</span> OTP sent — check your inbox
            </p>
            <TextField 
              fullWidth 
              name="otp" 
              label="Enter OTP"
              variant="outlined"
              onChange={formik.handleChange} 
              onBlur={formik.handleBlur} 
              value={formik.values.otp}
              error={formik.touched.otp && Boolean(formik.errors.otp)}
              helperText={formik.touched.otp && formik.errors.otp}
            />
          </div>
        )}

        <div className="pt-4">
          {!otpSent ? (
            <Button 
              onClick={handleSendOtp} 
              variant="contained" 
              fullWidth 
              size="large"
              disabled={auth.loading || !formik.values.email}
              sx={{ py: "14px", borderRadius: "8px", fontWeight: "bold" }}
            >
              {auth.loading ? <CircularProgress size={24} color="inherit" /> : "Send OTP"}
            </Button>
          ) : (
            <Button 
              onClick={() => formik.handleSubmit()} 
              variant="contained" 
              fullWidth 
              size="large"
              sx={{ py: "14px", borderRadius: "8px", fontWeight: "bold" }}
            >
              Login Securely
            </Button>
          )}
        </div>
      </div>
      
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity="error" variant="filled" sx={{ width: '100%', fontWeight: 'bold' }}>
          {sellerAuth.error}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default SellerLoginForm
