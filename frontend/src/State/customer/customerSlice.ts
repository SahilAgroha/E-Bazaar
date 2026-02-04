// src/State/customer/customerSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HomeCategory, HomeData } from "../../types/HomeCategory";
import { api } from "../../config/Api";

// Helper: group flat categories into HomeData
const groupIntoHome = (list: HomeCategory[]): HomeData => ({
  grid: list.filter((c) => c.section === "GRID"),
  shopByCategories: list.filter((c) => c.section === "SHOP_BY_CATEGORIES"),
  electricCategories: list.filter((c) => c.section === "ELECTRIC_CATEGORIES"),
  dealCategories: list.filter((c) => c.section === "DEALS"),
  id: 0,
  deals: [],
});

// =================== THUNKS ===================

// GET: backend already returns grouped Home
export const fetchHomePageData = createAsyncThunk<HomeData, { jwt?: string }>(
  "home/fetchHomePageData",
  async ({ jwt }, { rejectWithValue }) => {
    try {
      const res = await api.get<HomeData>(
        "/admin/home-category",
        jwt ? { headers: { Authorization: `Bearer ${jwt}` } } : undefined
      );
      console.log("Fetched homedata :", res.data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch home page data"
      );
    }
  }
);

// POST: backend returns grouped Home
export const createHomeCategories = createAsyncThunk<
  HomeData,
  { homeCategories: HomeCategory[]; jwt?: string }
>("home/createHomeCategories", async ({ homeCategories, jwt }, { rejectWithValue }) => {
  try {
    const res = await api.post(
      "/admin/home-category",
      homeCategories,
      jwt ? { headers: { Authorization: `Bearer ${jwt}` } } : undefined
    );
    console.log("Created home categories:", res.data);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to create home categories"
    );
  }
});

// PATCH: returns a single updated HomeCategory
export const updateHomeCategory = createAsyncThunk<
  HomeCategory,
  { id: number; homeCategory: Partial<HomeCategory>; jwt?: string }
>("home/updateHomeCategory", async ({ id, homeCategory, jwt }, { rejectWithValue }) => {
  try {
    const res = await api.patch(
      `/admin/home-category/${id}`,
      homeCategory,
      jwt ? { headers: { Authorization: `Bearer ${jwt}` } } : undefined
    );
    console.log("Updated home category:", res.data);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to update home category"
    );
  }
});

// DELETE: returns only id (we pass it manually)
export const deleteHomeCategory = createAsyncThunk<
  number,
  { id: number; jwt?: string }
>("home/deleteHomeCategory", async ({ id, jwt }, { rejectWithValue }) => {
  try {
    await api.delete(
      `/admin/home-category/${id}`,
      jwt ? { headers: { Authorization: `Bearer ${jwt}` } } : undefined
    );
    console.log("Deleted home category with id:", id);
    return id;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to delete home category"
    );
  }
});

// =================== SLICE ===================

interface HomeState {
  homePageData: HomeData | null;
  all: HomeCategory[]; // flat list for tables
  loading: boolean;
  error: string | null;
}

const initialState: HomeState = {
  homePageData: null,
  all: [],
  loading: false,
  error: null,
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetch
    builder
      .addCase(fetchHomePageData.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchHomePageData.fulfilled, (s, a) => {
        s.loading = false;
        s.homePageData = a.payload;
        s.all = [
          ...(a.payload.grid || []),
          ...(a.payload.shopByCategories || []),
          ...(a.payload.electricCategories || []),
          ...(a.payload.dealCategories || []),
        ];
      })
      .addCase(fetchHomePageData.rejected, (s, a) => {
        s.loading = false;
        s.error = (a.payload as string) || "Failed to fetch home page data";
      });

    // create
    builder
      .addCase(createHomeCategories.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(createHomeCategories.fulfilled, (s, a) => {
        s.loading = false;
        s.homePageData = a.payload;
        s.all = [
          ...(a.payload.grid || []),
          ...(a.payload.shopByCategories || []),
          ...(a.payload.electricCategories || []),
          ...(a.payload.dealCategories || []),
        ];
      })
      .addCase(createHomeCategories.rejected, (s, a) => {
        s.loading = false;
        s.error = (a.payload as string) || "Failed to create home categories";
      });

    // update
    builder
      .addCase(updateHomeCategory.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(updateHomeCategory.fulfilled, (s, a: PayloadAction<HomeCategory>) => {
        s.loading = false;
        const i = s.all.findIndex((x) => x.id === a.payload.id);
        if (i > -1) s.all[i] = a.payload;

        // rebuild grouped from flat list
        s.homePageData = groupIntoHome(s.all);
      })
      .addCase(updateHomeCategory.rejected, (s, a) => {
        s.loading = false;
        s.error = (a.payload as string) || "Failed to update home category";
      });

    // delete
    builder
      .addCase(deleteHomeCategory.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(deleteHomeCategory.fulfilled, (s, a: PayloadAction<number>) => {
        s.loading = false;
        s.all = s.all.filter((x) => x.id !== a.payload);
        s.homePageData = groupIntoHome(s.all);
      })
      .addCase(deleteHomeCategory.rejected, (s, a) => {
        s.loading = false;
        s.error = (a.payload as string) || "Failed to delete home category";
      });
  },
});

export default homeSlice.reducer;
