import {  createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiResponse, Deal, DealsState } from "../../types/dealType";
import { api } from "../../config/Api";

// All Done   



const initialState:DealsState={
    deals:[],
    loading:false,
    error:null,
    dealCreated:false,
    dealUpdated:false,
}

export const createDeal=createAsyncThunk('deals/createDeal',
    async(deal,{rejectWithValue})=>{
        try {
            const response=await api.post('/admin/deals',deal,{
                headers:{
                    "Content-Type":'application/json',
                    Authorization:`Bearer ${localStorage.getItem('jwt') || ''}`,
                },
            });
            console.log("createDeal ",response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data.message || "Faild to create Deal")
        }
    }
);

//get All Deals
export const getAllDeals = createAsyncThunk(
    'deals/getAllDeals',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/admin/deals', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt') || ''}`,
                },
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data.message || "Failed to fetch deals");
        }
    }
);

// Update Deal
export const updateDeal = createAsyncThunk(
    'deals/updateDeal',
    async ({ id, deal }: { id: number, deal: Deal }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/admin/deals/${id}`, deal, {
                headers: {
                    "Content-Type": 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('jwt') || ''}`,
                },
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data.message || "Failed to update deal");
        }
    }
);

export const deleteDeal=createAsyncThunk<ApiResponse,number>('deals/deleteDeal',
    async(id:number,{ rejectWithValue })=>{
        try {
            const response=await api.delete(`/admin/deals/${id}`,{
                headers:{
                    "Content-Type":'application/json',
                    Authorization:`Bearer ${localStorage.getItem('jwt') || ''}`,
                },
            });
            console.log('deleteDeal ',response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data.message || "Faild to delete deal");
        }
    }
);


const dealSlice = createSlice({
    name: "deals",
    initialState,
    reducers: {
        resetDealStatus(state) {
            state.dealCreated = false;
            state.dealUpdated = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get All Deals
            .addCase(getAllDeals.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllDeals.fulfilled, (state, action) => {
                state.loading = false;
                state.deals = action.payload;
            })
            .addCase(getAllDeals.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Create Deal
            .addCase(createDeal.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createDeal.fulfilled, (state, action) => {
                state.loading = false;
                state.dealCreated = true;
                state.deals.push(action.payload);
            })
            .addCase(createDeal.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update Deal
            .addCase(updateDeal.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateDeal.fulfilled, (state, action) => {
                state.loading = false;
                state.dealUpdated = true;
                const index = state.deals.findIndex(d => d.id === action.payload.id);
                if (index !== -1) state.deals[index] = action.payload;
            })
            .addCase(updateDeal.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Delete Deal
            .addCase(deleteDeal.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteDeal.fulfilled, (state, action) => {
                state.loading = false;
                state.deals = state.deals.filter(d => d.id !== action.meta.arg);
            })
            .addCase(deleteDeal.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const { resetDealStatus } = dealSlice.actions;
export default dealSlice.reducer;


