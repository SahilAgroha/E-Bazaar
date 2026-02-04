import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HomeCategory } from '../../types/HomeCategory';
import { api } from '../../config/Api';

// All Done

const API_URL='/admin'

export const updateHomeCategory=createAsyncThunk<HomeCategory,{id:number,data:HomeCategory}>('homeCategory/updateHomeCategory',
    async({id,data},{rejectWithValue})=>{
        try {
            const response=await api.patch(`${API_URL}/home-category/${id}`,data);
            console.log("category update ",response.data);
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data.message || "Faild to update home category")
        }
    }
);

export const fetchHomeCategories=createAsyncThunk<HomeCategory[]>('homeCategory/fetchHomeCategories',
    async(_,{rejectWithValue})=>{
        try {
            const response=await api.get(`${API_URL}/home-category`);
            console.log("fetchHomeCategories ",response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data.message || "Faild to fetch home category");
        }
    }
);

interface HomeCategoryState{
    categories:HomeCategory[];
    loading:boolean;
    error:string | null;
    categoryUpdate:boolean;
}
const initialState:HomeCategoryState={
    categories: [],
    loading: false,
    error: null,
    categoryUpdate: false
}
const adminSlice=createSlice({
    name:"homeCategory",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(updateHomeCategory.pending,(state)=>{
            state.loading=true;
            state.error=null;
            state.categoryUpdate=false;
        })
        .addCase(updateHomeCategory.fulfilled,(state,action)=>{
            state.loading=false;
            state.categoryUpdate=true;
            const index=state.categories.findIndex((category)=>category.id===action.payload.id);
            if(index!==-1){
                state.categories.push[index]=action.payload;
            } else {
                state.categories.push(action.payload);
            }
        })
        .addCase(updateHomeCategory.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string;
        });
        builder.addCase(fetchHomeCategories.pending,(state)=>{
            state.loading=true;
            state.error=null;
            state.categoryUpdate=false;
        })
        .addCase(fetchHomeCategories.fulfilled,(state,action)=>{
            state.loading=false;
            state.categories=action.payload;
        })
        .addCase(fetchHomeCategories.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string;
        });
    }
})

export default adminSlice.reducer