import { Button, TextField } from '@mui/material'
import { useFormik } from 'formik'
import React from 'react'
import { useAppDispatch } from '../../../State/Store'
import { sendLoginSignupOtp,signin } from '../../../State/AuthSlice'
import { sellerLogin } from '../../../State/seller/sellerAuthSlice'
// import { useAppDispatch } from '../../../State/Store'
// import { sentLoginSignupOtp } from '../../../Extra/AuthSlice'

const SellerLoginForm = () => {
  const dispatch=useAppDispatch();
  const formik=useFormik({
    initialValues:{
      email:"",
      otp:"",
    },
    onSubmit:(values)=>{
      console.log("form data ",values)
      dispatch(sellerLogin({ email: values.email, otp: values.otp }))
    }
  })

  const handleSendOtp=()=>{
    dispatch(sendLoginSignupOtp({email:formik.values.email}))
  }

  const handleLogin=()=>{
    // dispatch(signin())
  }
  return (
    <div>
      <h1 className="text-center font-bold text-xl text-[#00927c] pb-5">Login As Seller</h1>
      <div className="space-y-5">
        <TextField fullWidth name='email' label="Email"
        onChange={formik.handleChange} onBlur={formik.handleBlur} 
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}/>
        
        {true && <div className='space-y-5'>
          <p className='font-medium text-sm opacity-60'>Enter OTP sent to your email</p>
          <TextField fullWidth name='otp' label="OTP"
            onChange={formik.handleChange} onBlur={formik.handleBlur} 
            error={formik.touched.otp && Boolean(formik.errors.otp)}
            helperText={formik.touched.otp && formik.errors.otp}/>
          </div>}
          <Button onClick={handleSendOtp} variant='contained' fullWidth sx={{py:"11px"}}>
            Send OTP
          </Button>
          <Button onClick={()=>formik.handleSubmit()} variant='contained' fullWidth sx={{py:"11px"}}>
            Login
          </Button>
      </div>
      
    </div>
  )
}

export default SellerLoginForm
