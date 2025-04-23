import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { reportService } from "../../../services/admin/reportService";

export const getSalesRevenueOverTime = createAsyncThunk(
    "reports/salesRevenue",
    async ({ from, to }, thunkAPI) => {
        try {
            const response = await reportService.getSalesRevenueOverTime(from, to);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getBestSellerProducts = createAsyncThunk(
    "reports/bestSellerProducts",
    async ({ from, to }, thunkAPI) => {
        try {
            const response = await reportService.getBestSellerProducts(from, to);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getMostLikedProducts = createAsyncThunk(
    "reports/mostLikedProducts",
    async ({ from, to }, thunkAPI) => {
        try {
            const response = await reportService.getMostLikedProducts(from, to);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getRevenueByCategory = createAsyncThunk(
    "reports/revenueByCategory",
    async (params, thunkAPI) => {
        try {
            const response = await reportService.getRevenueByCategory(params);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getTopSpendingCustomers = createAsyncThunk(
    "reports/topSpendingCustomers",
    async ({ from, to }, thunkAPI) => {
        try {
            const response = await reportService.getTopSpendingCustomers(from, to);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getNewAccountsThisMonth = createAsyncThunk(
    "reports/newAccounts",
    async ({ month, year }, thunkAPI) => {
        try {
            const response = await reportService.getNewAccountsThisMonth(month, year);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getInvoicesOverTime = createAsyncThunk(
    "reports/invoicesOverTime",
    async ({ from, to }, thunkAPI) => {
        try {
            const response = await reportService.getInvoicesOverTime(from, to);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

const reportSlice = createSlice({
    name: "reports",
    initialState: {
        salesRevenue: [],
        bestSellerProducts: [],
        mostLikedProducts: [],
        revenueByCategory: [],
        topSpendingCustomers: [],
        newAccounts: [],
        invoicesOverTime: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getSalesRevenueOverTime.pending, (state) => {
                state.loading = true;
            })
            .addCase(getSalesRevenueOverTime.fulfilled, (state, action) => {
                state.loading = false;
                state.salesRevenue = action.payload;
            })
            .addCase(getSalesRevenueOverTime.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add similar cases for other thunks
            .addCase(getBestSellerProducts.fulfilled, (state, action) => {
                state.bestSellerProducts = action.payload;
            })
            .addCase(getMostLikedProducts.fulfilled, (state, action) => {
                state.mostLikedProducts = action.payload;
            })
            .addCase(getRevenueByCategory.fulfilled, (state, action) => {
                state.revenueByCategory = action.payload;
            })
            .addCase(getTopSpendingCustomers.fulfilled, (state, action) => {
                state.topSpendingCustomers = action.payload;
            })
            .addCase(getNewAccountsThisMonth.fulfilled, (state, action) => {
                state.newAccounts = action.payload;
            })
            .addCase(getInvoicesOverTime.fulfilled, (state, action) => {
                state.invoicesOverTime = action.payload;
            });
    }
});

export default reportSlice.reducer; 