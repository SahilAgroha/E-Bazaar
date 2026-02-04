import {User} from '../../types/userTypes'
import {Order} from '../../types/orderTypes'
import { Seller } from '../../types/SellerTypes';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { api } from '../../config/Api';


export interface Transaction{
    id:number;
    customer:User;
    order:Order;
    seller:Seller;
    date:string;
}

interface TransactionState{
    transactions:Transaction[],
    transaction:Transaction | null,
    loading:boolean;
    error: string | null,
}

const initialState:TransactionState={
    transactions:[],
    transaction:null,
    loading:false,
    error:null,
}

export const fetchTransactionBySeller=createAsyncThunk<Transaction[],string,{rejectValue:string}>('transactions/fetchTransactionBySeller',
    async(jwt,{rejectWithValue})=>{
        try {
            const response=await api.get('/api/transactions/seller',{   // impl
                headers:{
                    Authorization:`Bearer ${jwt}`,
                },
            });
            console.log("fetchTransactionBySeller ",response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data.message || 'Faild to fetch Transaction')
        }
    }
);

export const fetchAllTransaction=createAsyncThunk<Transaction[],void,{rejectValue:string}>('transactions/fetchAllTransaction',
    async(_,{rejectWithValue})=>{
        try {
            const response=await api.get('/api/transactions',{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem('jwt')}`,
                }
            });
            console.log("fetchAllTransaction ",response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data.message || "Faild to fetch All Transaction")
        }
    }
);

const transactionSlice=createSlice({
    name:"transactions",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(fetchTransactionBySeller.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(fetchTransactionBySeller.fulfilled,(state,action)=>{
            state.loading=false;
            state.transactions=action.payload;
        })
        .addCase(fetchTransactionBySeller.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string;
        });
        builder.addCase(fetchAllTransaction.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(fetchAllTransaction.fulfilled,(state,action)=>{
            state.loading=false;
            state.transactions=action.payload;
        })
        .addCase(fetchAllTransaction.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string;
        });
    }
})

export default transactionSlice.reducer

