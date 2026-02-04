// src/components/seller/VerifySellerOtp.jsx
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import { CircularProgress } from "@mui/material";
import { verifySellerOtp } from "../../../State/seller/sellerAuthSlice";

const VerifySellerOtp = () => {
  const { otp } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.sellerAuth);

  useEffect(() => {
    if (otp) {
      dispatch(verifySellerOtp(otp))
        .unwrap()
        .then(() => {
          // ✅ after successful verification
          setTimeout(() => navigate("/seller/login"), 2000);
        })
        .catch(() => {});
    }
  }, [otp, dispatch, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {error ? (
        <p className="text-red-600">Verification failed: {error}</p>
      ) : (
        <p className="text-green-600">✅ Email verified successfully! Redirecting to login...</p>
      )}
    </div>
  );
};

export default VerifySellerOtp;
