import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/Api";
import { AccountStatus } from "../../types/SellerTypes";

// All Done

export const fetchSellerProfile=createAsyncThunk("/sellers/fetchSellerProfile",
    async(jwt:String,{rejectWithValue})=>{
        try {
            const response =await api.get("sellers/profile",{   // Done
                headers:{
                    Authorization:`Bearer ${jwt}`
                },
            }) 
            console.log("fetch seller profile - - ",response.data);
            return response.data
            
        } catch (error) {
            console.log("error - - - ",error);
            return rejectWithValue(error.message || "Failed to fetch seller profile");
        }
    }
)


// 🔹 Fetch all sellers (optional filter by status)
export const fetchAllSellers = createAsyncThunk(
  "sellers/fetchAllSellers",
  async ({ status, jwt }: { status?: AccountStatus, jwt: string }, { rejectWithValue }) => {
    try {
      // **FIXED**: The API path is now corrected to include "/api"
      const url = status ? `/sellers?status=${status}` : "/sellers";    //Done 
      const response = await api.get(url, {
        headers: { Authorization: `Bearer ${jwt}` }
      });
      console.log("All Sellers - - ", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch sellers");
    }
  }
);

// 🔹 Get seller by ID
export const fetchSellerById = createAsyncThunk<any, number>(
  "sellers/fetchSellerById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/sellers/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch seller");
    }
  }
);

// 🔹 Update seller profile (with JWT)
export const updateSeller = createAsyncThunk<any, { jwt: string; seller: any }>(
  "sellers/updateSeller",
  async ({ jwt, seller }, { rejectWithValue }) => {
    try {
      const response = await api.patch("/sellers", seller, {   // Done
        headers: { Authorization: `Bearer ${jwt}` },
      });
      console.log("Updated seller - - ", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update seller");
    }
  }
);

// 🔹 Delete seller
export const deleteSeller = createAsyncThunk<void, number>(
  "sellers/deleteSeller",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/sellers/${id}`);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete seller");
    }
  }
);

// 🔹 Update seller status (Admin use-case)
export const updateSellerStatus = createAsyncThunk(
  "sellers/updateSellerStatus",
  async ({ id, status, jwt }: { id: number; status: AccountStatus; jwt: string }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/api/seller/${id}/status/${status}`, null, {
        headers: { Authorization: `Bearer ${jwt}` }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update seller status");
    }
  }
);

// 🔹 Fetch seller report (for logged-in seller)
export const fetchSellerReport = createAsyncThunk<any, string>(
  "sellers/fetchSellerReport",
  async (jwt, { rejectWithValue }) => {
    try {
      const response = await api.get("/sellers/report", {   // Done 
        headers: { Authorization: `Bearer ${jwt}` },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch report");
    }
  }
);
interface SellerState{
    sellers:any[],
    selectedSeller:any,
    profile:any,
    report:any,
    loading:boolean,
    error:any,
}
const initialState:SellerState={
    sellers:[],
    selectedSeller:null,
    profile:null,
    report:null,
    loading:false,
    error:null,
}



const sellerSlice = createSlice({
  name: "sellers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSellerProfile.pending,(state)=>{
            state.loading=true;
        })
        .addCase(fetchSellerProfile.fulfilled,(state,action)=>{
            state.loading=false;
            state.profile = action.payload;
        })
        .addCase(fetchSellerProfile.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })
    builder
      // fetch all
      .addCase(fetchAllSellers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllSellers.fulfilled, (state, action) => {
        state.loading = false;
        state.sellers = action.payload;
      })
      .addCase(fetchAllSellers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // fetch by id
    builder
      .addCase(fetchSellerById.fulfilled, (state, action) => {
        state.selectedSeller = action.payload;
      });

    // update seller
    builder
      .addCase(updateSeller.fulfilled, (state, action) => {
        state.profile = action.payload;
      });

    // delete seller
    builder
      .addCase(deleteSeller.fulfilled, (state, action) => {
        state.sellers = state.sellers.filter((s) => s.id !== action.meta.arg);
      });

    // update status
    builder
      .addCase(updateSellerStatus.fulfilled, (state, action) => {
        const idx = state.sellers.findIndex((s) => s.id === action.payload.id);
        if (idx >= 0) state.sellers[idx] = action.payload;
      });

    // fetch report
    builder
      .addCase(fetchSellerReport.fulfilled, (state, action) => {
        state.report = action.payload;
      });
  },
});


export default sellerSlice.reducer