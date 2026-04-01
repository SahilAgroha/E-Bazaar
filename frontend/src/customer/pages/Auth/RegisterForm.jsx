import React, { useState, useEffect } from "react";
import { Button, TextField, Snackbar, Alert } from "@mui/material";
import { useFormik } from "formik";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import { sendLoginSignupOtp, signup } from "../../../State/AuthSlice";

const RegisterForm = () => {
  const dispatch = useAppDispatch();
  const [otpSent, setOtpSent] = useState(false);
  const { auth } = useAppSelector((store) => store);

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    if (auth.error) {
      setSnackbarOpen(true);
    }
  }, [auth.error]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      otp: "",
      fullName: "",
    },
    onSubmit: (values) => {
      console.log("Register form values:", values);
      dispatch(signup(values));
    },
  });

  const handleSendOtp = async () => {
    if (!formik.values.email) {
      alert("Please enter email first");
      return;
    }
    await dispatch(sendLoginSignupOtp({ email: formik.values.email }));
    setOtpSent(true);
  };

  return (
    <div>
      <h1 className="text-center font-bold text-xl text-primary-color pb-8">
        Signup
      </h1>

      <form onSubmit={formik.handleSubmit} className="space-y-5">
        {/* Email Field */}
        <TextField
          fullWidth
          name="email"
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />

        {/* OTP + Full Name fields only if OTP is sent */}
        {otpSent && (
          <div className="space-y-5">
            <div className="space-y-2">
              <p className="font-medium text-sm opacity-60">
                Enter OTP sent to your email
              </p>
              <TextField
                fullWidth
                name="otp"
                label="OTP"
                value={formik.values.otp}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.otp && Boolean(formik.errors.otp)}
                helperText={formik.touched.otp && formik.errors.otp}
              />

              <TextField
                fullWidth
                name="fullName"
                label="Full Name"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                helperText={formik.touched.fullName && formik.errors.fullName}
              />
            </div>
          </div>
        )}

        {/* Buttons */}
        {!otpSent && (
          <Button
            onClick={handleSendOtp}
            variant="contained"
            fullWidth
            sx={{ py: "11px" }}
          >
            Send OTP
          </Button>
        )}
        {otpSent && (
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ py: "11px" }}
          >
            Signup
          </Button>
        )}
      </form>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity="error" variant="filled" sx={{ width: '100%', fontWeight: 'bold' }}>
          {auth.error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default RegisterForm;
