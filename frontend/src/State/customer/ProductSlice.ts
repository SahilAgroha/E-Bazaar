import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/Api";
import {Product} from '../../types/ProductTypes'

//All Done  // impl


const API_URL='/products'


export const fetchProductById=createAsyncThunk('products/fetchProductById',
    async(productId,{rejectWithValue})=>{
        try {
            const response=await api.get(`${API_URL}/${productId}`);  // impl
            const data=response.data;
            console.log('Productdetails data - - - ',data);
            return data;
        } catch (error) {
            console.log("error - - - ",error);
            rejectWithValue(error.message);
        }
    }
)

export const searchProduct=createAsyncThunk('products/searchProduct',
    async(query,{rejectWithValue})=>{
        try {
            const response=await api.get(`${API_URL}/search`,{   // impl   
                params:{
                    query,
                }
            });
            const data=response.data;
            console.log('search product data - - - ',data);
            return data;
        } catch (error) {
            console.log("error - - - ",error);
            rejectWithValue(error.message);
        }
    }
)

export const fetchAllProduct = createAsyncThunk<any, any>(
  'products/fetchAllProduct',
  async (params, { rejectWithValue }) => {
    try {
      // Ensure params is always an object
      const safeParams = (params && typeof params === 'object') ? params : {};

      const response = await api.get(`${API_URL}`, {   // impl
        params: {
          ...safeParams,
          pageNumber: safeParams.pageNumber || 0
        }
      });

      const data = response.data;
      console.log('Product details data - - - ', data);
      return data;
    } catch (error: any) {
      console.log('error - - - ', error);
      return rejectWithValue(error?.message || 'Something went wrong');
    }
  }
);



interface ProductState{
    product:Product | null;
    products:Product[];
    totalPages:number;
    loading:boolean;
    error:string | null | undefined | any;
    searchProduct:Product[];
}
 const initialState:ProductState={
    product:null,
    products:[],
    totalPages:1,
    loading:false,
    error: null ,
    searchProduct:[],
 }

 const productSlice=createSlice({
    name:"products",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(fetchProductById.pending,(state)=>{
            state.loading=true;
        });
        builder.addCase(fetchProductById.fulfilled,(state,action)=>{
            state.loading=false;
            state.product=action.payload
        });
        builder.addCase(fetchProductById.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        });

        builder.addCase(fetchAllProduct.pending,(state)=>{
            state.loading=true;
        });
        builder.addCase(fetchAllProduct.fulfilled,(state,action)=>{
            state.loading=false;
            state.products=action.payload.content
        });
        builder.addCase(fetchAllProduct.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        });

        builder.addCase(searchProduct.pending,(state)=>{
            state.loading=true;
        });
        builder.addCase(searchProduct.fulfilled,(state,action)=>{
            state.loading=false;
            state.searchProduct = Array.isArray(action.payload) ? action.payload : [];
        });

        builder.addCase(searchProduct.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        });
    }
 })

 export default productSlice.reducer;