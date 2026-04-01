import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../config/Api";
import { User } from "../types/userTypes";


// All Done  // impl

// Impl 
export const sendLoginSignupOtp=createAsyncThunk("/auth/sendLoginSignupOtp",
    async({email}:{email:string},{rejectWithValue})=>{
        try {
            const response =await api.post("/auth/sent/login-signup-otp",{email}) 
            // console.log("login otp  - - ",response);
            return response.data;
        } catch (error: any) {
            console.log("error - - - ",error);
            return rejectWithValue(error.response?.data?.message || "Failed to send OTP");
        }
    }
)

// impl
export const signin=createAsyncThunk<any,any>("/auth/signin",
    async(loginRequest,{rejectWithValue})=>{
        try {
            const response =await api.post("auth/signing",loginRequest) 
            console.log("Signing  - - ",response);
            localStorage.setItem('jwt',response.data.jwt)
            return response.data
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Login failed");
        }
    }
)

// impl
export const signup=createAsyncThunk<any,any>("/auth/signup",
    async(signupRequest,{rejectWithValue})=>{
        try {
            const response =await api.post("/auth/signup",signupRequest) 
            // console.log("Signup  - - ",response);
            localStorage.setItem('jwt',response.data.jwt)
            return response.data
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Signup failed");
        }
    }
)

// impl
export const fetchUserProfile = createAsyncThunk<any, any>(
  "/auth/fetchUserProfile",
  async ({ jwt }, { rejectWithValue }) => {
    try {
      if (!jwt) {
        return rejectWithValue("JWT token missing");
      }

      const cleanToken = jwt.trim().replace(/^"|"$/g, "");

      const response = await api.get("/users/profile", {
        headers: {
          Authorization: `Bearer ${cleanToken}`,
        },
      });

      console.log("User profile - - ", response.data);
      return response.data;

    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || "Something went wrong");
    }
  }
);

//impl
export const logout=createAsyncThunk<any,any>('/auth/logout',
    async(navigate,{rejectWithValue})=>{
        try {
            localStorage.clear();
            // console.log('Logout success');
            navigate('/');
        } catch (error) {
            // console.log("error - - ",error);
        }
    }
)

interface AuthState{
    jwt:string | null,
    otpSent:boolean,
    isLoggedIn:boolean,
    user:User | null,
    loading:boolean,
    error:string | null,
}

const initialState:AuthState={
    jwt:null,
    otpSent:false,
    isLoggedIn:false,
    user:null,
    loading:false,
    error:null,
}

const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        const getErrorMessage = (payload: any): string => {
            if (typeof payload === 'string') return payload;
            if (payload && typeof payload === 'object') {
                return payload.message || payload.error || "An unexpected error occurred";
            }
            return "An unexpected error occurred";
        };
        builder.addCase(sendLoginSignupOtp.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        builder.addCase(sendLoginSignupOtp.fulfilled,(state)=>{
            state.loading=false;
            state.otpSent=true;
        })
        builder.addCase(sendLoginSignupOtp.rejected,(state,action)=>{
            state.loading=false;
            state.error=getErrorMessage(action.payload);
        })

        builder.addCase(signin.pending,(state)=>{
            state.loading=true;
            state.error=null;
        });
        builder.addCase(signin.fulfilled,(state,action)=>{
            state.loading=false;
            state.jwt=action.payload?.jwt ?? action.payload
            state.isLoggedIn=true;
        });
        builder.addCase(signin.rejected,(state,action)=>{
            state.loading=false;
            state.error=getErrorMessage(action.payload);
            state.isLoggedIn=false;
        });

        builder.addCase(signup.pending,(state)=>{
            state.loading=true;
            state.error=null;
        });
        builder.addCase(signup.fulfilled,(state,action)=>{
            state.loading=false;
            state.jwt=action.payload?.jwt ?? action.payload
            state.isLoggedIn=true;
        });
        builder.addCase(signup.rejected,(state,action)=>{
            state.loading=false;
            state.error=getErrorMessage(action.payload);
            state.isLoggedIn=false;
        });

        builder.addCase(fetchUserProfile.pending,(state)=>{
            state.loading=true;
            state.error=null;
        });
        builder.addCase(fetchUserProfile.fulfilled,(state,action)=>{
            state.loading=false;
            state.user=action.payload
            state.isLoggedIn=true;
        });
        builder.addCase(fetchUserProfile.rejected,(state,action)=>{
            state.loading=false;
            state.error=getErrorMessage(action.payload);
            state.isLoggedIn=false;
        });

        builder.addCase(logout.fulfilled,(state)=>{
            state.jwt=null
            state.isLoggedIn=false
            state.user=null
        })
    }
})

export default authSlice.reducer