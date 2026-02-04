import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "../../config/Api";

const API_URL = "http://localhost:8080/admin"; // adjust base path

// ===== SELLERS =====
export const fetchAllSellers = createAsyncThunk(
  "seller/fetchAll",
  async (status, { rejectWithValue }) => {
    try {
      const res = await api.get(`/sellers`, {
        params: status ? { status } : {}
      });
      console.log('fetchAllSellers - - -',res.data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchSellerById = createAsyncThunk("seller/fetchById", async (id) => {
  const res = await api.get(`/sellers/${id}`);
  console.log('fetchSellerById - - -',res.data);
  return res.data;
});

export const updateSellerStatus = createAsyncThunk(
  "seller/updateStatus",
  async ({ id, status }) => {
    const res = await api.patch(`/api/seller/${id}/status/${status}`);
    console.log('updateSellerStatus - - -',res.data);
    return res.data;
  }
);

export const deleteSeller = createAsyncThunk("seller/delete", async (id) => {
  await axios.delete(`${API_URL}/seller/${id}`);
  console.log('deleteSeller - - -',id);
  return id;
});

// ===== TRANSACTIONS =====
export const fetchAllTransactions = createAsyncThunk(
  "transaction/fetchAll",
  async () => {
    const res = await axios.get(`${API_URL}/transaction`);
    console.log('fetchAllTransactions - - -',res.data);
    return res.data;
  }
);

// ===== SELLER REPORT =====
export const fetchSellerReport = createAsyncThunk(
  "seller/fetchReport",
  async (_, { rejectWithValue }) => {
    try {
      const jwt = localStorage.getItem("jwt");
      const res = await api.get(`/sellers/report`, {
        headers: { Authorization: `Bearer ${jwt}` }
      });
      console.log('fetchSellerReport - - -',res.data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching report");
    }
  }
);

const sellerSlice = createSlice({
  name: "seller",
  initialState: {
    sellers: [],
    transactions: [],
    seller: null,
    report: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch sellers
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
      })

      // fetch seller by id
      .addCase(fetchSellerById.fulfilled, (state, action) => {
        state.seller = action.payload;
      })

      // update seller status
      .addCase(updateSellerStatus.fulfilled, (state, action) => {
        const idx = state.sellers.findIndex((s) => s.id === action.payload.id);
        if (idx !== -1) state.sellers[idx] = action.payload;
      })

      // delete seller
      .addCase(deleteSeller.fulfilled, (state, action) => {
        state.sellers = state.sellers.filter((s) => s.id !== action.payload);
      })

      // fetch transactions
      .addCase(fetchAllTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload;
      })
      // fetch seller report
      .addCase(fetchSellerReport.fulfilled, (state, action) => {
        state.report = action.payload;
      });
  }
});

export default sellerSlice.reducer;
