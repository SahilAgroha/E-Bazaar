import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/Api";
import { Product } from "../../types/ProductTypes";

// ✅ Fetch Seller Products
export const fetchSellerProducts = createAsyncThunk<Product[], string | null>(
  "/sellerProduct/fetchSellerProducts",
  async (jwt, { rejectWithValue }) => {
    try {
      const response = await api.get(`/sellers/products`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data.message || "Failed to fetch products");
    }
  }
);

// ✅ Create Product
export const createProduct = createAsyncThunk<Product, { request: any; jwt: string | null }>(
  "/sellerProduct/createProduct",
  async ({ request, jwt }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/sellers/products`, request, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data.message || "Failed to create product");
    }
  }
);

// ✅ Update Product
export const updateProduct = createAsyncThunk<Product, { productId: number; product: Product; jwt: string | null }>(
  "/sellerProduct/updateProduct",
  async ({ productId, product, jwt }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/sellers/products/${productId}`, product, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data.message || "Failed to update product");
    }
  }
);

// ✅ Delete Product
export const deleteProduct = createAsyncThunk<number, { productId: number; jwt: string | null }>(
  "/sellerProduct/deleteProduct",
  async ({ productId, jwt }, { rejectWithValue }) => {
    try {
      await api.delete(`/sellers/products/${productId}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      return productId; // return deleted id
    } catch (error: any) {
      return rejectWithValue(error.response?.data.message || "Failed to delete product");
    }
  }
);

interface SellerProductState {
  products: Product[];
  loading: boolean;
  error: string | null | undefined;
}

const initialState: SellerProductState = {
  products: [],
  loading: false,
  error: null,
};

const sellerProductSlice = createSlice({
  name: "sellerProduct",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // FETCH
    builder
      .addCase(fetchSellerProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSellerProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchSellerProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // CREATE
    builder
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      });

    // UPDATE
    builder
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.products = state.products.map((p) =>
          p.id === action.payload.id ? action.payload : p
        );
      });

    // DELETE
    builder
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload);
      });
  },
});

export default sellerProductSlice.reducer;
