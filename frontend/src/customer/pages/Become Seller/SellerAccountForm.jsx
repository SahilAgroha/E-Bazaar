import { Button, Step, StepLabel, Stepper, Snackbar, Alert } from "@mui/material";
import React, { useState, useEffect } from "react";
import BecomeSellerFormStep1 from "./BecomeSellerFormStep1";
import { useFormik } from "formik";
import BecomeSellerFormStep2 from "./BecomeSellerFormStep2";
import BecomeSellerFormStep3 from "./BecomeSellerFormStep3";
import BecomeSellerFormStep4 from "./BecomeSellerFormStep4";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import { createSeller } from "../../../State/seller/sellerAuthSlice";

const steps = [
  "Tax Details & Mobile",
  "Pickup Address",
  "Bank Details",
  "Supplier Details",
];

const SellerAccountForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const dispatch = useAppDispatch();

  const { createdSeller, loading, error } = useAppSelector(
    (state) => state.sellerAuth
  );

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    if (error) {
      setSnackbarOpen(true);
    }
  }, [error]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const formik = useFormik({
    initialValues: {
      sellerName: "",
      email: "",
      password: "",
      mobile: "",
      gstin: "",

      businessDetails: {
        businessName: "",
        businessEmail: "",
        businessMobile: "",
      },

      bankDetails: {
        accountNumber: "",
        accountHolderName: "",
        ifscCode: "",
      },

      pickupAddress: {
        name: "",
        mobile: "",
        pinCode: "",
        address: "",
        locality: "",
        city: "",
        state: "",
      },
    },
    validate: (values) => {
      const errors = {};
      if (!values.sellerName) errors.sellerName = "Required";
      if (!values.email) errors.email = "Required";
      if (!values.password) errors.password = "Required";
      if (!values.mobile) errors.mobile = "Required";
      
      if (!values.bankDetails.accountNumber) {
        if (!errors.bankDetails) Object.assign(errors, { bankDetails: {} });
        (errors.bankDetails).accountNumber = "Required";
      }
      
      return errors;
    },
    onSubmit: (values) => {
      console.log("Submitting Seller Form:", values);
      dispatch(createSeller(values));
    },
  });

  const handleStep = (value) => () => {
    if (activeStep < steps.length - 1 || (activeStep > 0 && value === -1)) {
      setActiveStep(activeStep + value);
    }
    if (activeStep === steps.length - 1 && value === 1) {
      formik.handleSubmit();
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-10">
        <h1 className="font-bold text-3xl text-gray-800 mb-2">Setup Seller Account</h1>
        <p className="text-gray-500 text-sm">Fill out the details below to complete your registration</p>
      </div>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 6 }}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel 
              StepIconProps={{
                 sx: {
                   "&.Mui-active": { color: "#00927c" },
                   "&.Mui-completed": { color: "#00927c" },
                 }
              }}
            >
               {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <section className="space-y-10">
        <div className="min-h-[300px]">
          {activeStep === 0 ? (
            <BecomeSellerFormStep1 formik={formik} />
          ) : activeStep === 1 ? (
            <BecomeSellerFormStep2 formik={formik} />
          ) : activeStep === 2 ? (
            <BecomeSellerFormStep3 formik={formik} />
          ) : (
            <BecomeSellerFormStep4 formik={formik} />
          )}
        </div>

        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert onClose={handleCloseSnackbar} severity="error" variant="filled" sx={{ width: '100%', fontWeight: 'bold' }}>
            {error}
          </Alert>
        </Snackbar>
        {createdSeller && (
          <div className="p-3 bg-green-50 text-green-600 rounded-md text-center font-medium">
            Account created successfully. Check your email.
          </div>
        )}

        <div className="flex justify-between items-center pt-6 border-t border-gray-100">
          <Button 
            onClick={handleStep(-1)} 
            disabled={activeStep === 0}
            variant="text"
            sx={{ fontWeight: "bold", color: "gray" }}
          >
            Back
          </Button>
          <Button 
            onClick={handleStep(1)} 
            disabled={loading}
            variant="contained"
            size="large"
            sx={{ px: 4, py: 1.5, borderRadius: "8px", fontWeight: "bold", backgroundColor: "#00927c", "&:hover": { backgroundColor: "#007a68" } }}
          >
            {activeStep === steps.length - 1
              ? loading
                ? "Creating..."
                : "Create Account"
              : "Continue"}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default SellerAccountForm;