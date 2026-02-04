// import { createAsyncThunk } from "@reduxjs/toolkit";
// import { api } from "../config/Api";

// export const sentLoginSignupOtp=createAsyncThunk("/auth/sentLoginSignupOtp",
//     async({email},{rejectWithValue})=>{
//         try {
//             const response=await api.post("/auth/sent/login-signup-otp",{email});
//             console.log("login otp   ",response);
//             return response.data
//         } catch (error) {
//             console.log("error - - - ",error);
//             return rejectWithValue(error.response?.data || "Something went wrong");
//         }
//     }
// )