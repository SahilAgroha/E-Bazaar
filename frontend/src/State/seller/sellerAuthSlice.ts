import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/Api";


//Done // impl


// ========== CREATE SELLER ==========
export const createSeller = createAsyncThunk<any, any>(
  "sellerAuth/createSeller",
  async (sellerRequest, { rejectWithValue }) => {
    try {
      const response = await api.post("/sellers", sellerRequest);   // impl
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create seller");
    }
  }
);

// ========== SELLER LOGIN ==========
export const sellerLogin = createAsyncThunk<any, any>(
  "sellerAuth/sellerLogin",
  async (loginRequest, { rejectWithValue }) => {
    try {
      const response = await api.post("/sellers/login", loginRequest);  // impl    
      const jwt = response.data.jwt;
      localStorage.setItem("jwt", jwt);
      return { jwt, seller: response.data.seller };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// ========== VERIFY SELLER OTP ==========
export const verifySellerOtp = createAsyncThunk<any, string>(
  "sellerAuth/verifySellerOtp",
  async (otp, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/sellers/verify/${otp}`);  // impl
      
      return response.data; // verified Seller object
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Invalid OTP");
    }
  }
);

interface SellerAuthState {
  jwt: string | null;
  seller: any | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  createdSeller: any | null;
  verifiedSeller: any | null; // ✅ NEW FIELD
}

const initialState: SellerAuthState = {
  jwt: localStorage.getItem("jwt") || null,
  seller: null,
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem("jwt"),
  createdSeller: null,
  verifiedSeller: null,
};

const sellerAuthSlice = createSlice({
  name: "sellerAuth",
  initialState,
  reducers: {
    sellerLogout: (state) => {
      state.jwt = null;
      state.seller = null;
      state.isAuthenticated = false;
      localStorage.removeItem("jwt");
    },
  },
  extraReducers: (builder) => {
    // CREATE SELLER
    builder
      .addCase(createSeller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSeller.fulfilled, (state, action) => {
        state.loading = false;
        state.createdSeller = action.payload;
      })
      .addCase(createSeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // LOGIN
    builder
      .addCase(sellerLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sellerLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.jwt = action.payload.jwt;
        state.seller = action.payload.seller;
        state.isAuthenticated = true;
      })
      .addCase(sellerLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // VERIFY SELLER OTP
    builder
      .addCase(verifySellerOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifySellerOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.verifiedSeller = action.payload;
      })
      .addCase(verifySellerOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { sellerLogout } = sellerAuthSlice.actions;
export default sellerAuthSlice.reducer;
