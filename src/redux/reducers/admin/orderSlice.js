import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import orderService from "../../../services/admin/orderService";

export const getOrders = createAsyncThunk(
    "orders/getOrders",
    async ({ page, limit, sortBy, orderBy, status }, thunkAPI) => {
        try {
            const response = await orderService.getOrdersAPI({ 
                page, 
                limit,
                sortBy,
                orderBy,
                status
            });
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getOrdersByStatus = createAsyncThunk(
    "orders/getByStatus",
    async ({ status, page, limit, sortBy, orderBy }, thunkAPI) => {
        try {
            const response = await orderService.getOrderByStatusAPI({ 
              status,
              page, 
              limit,
              sortBy,
              orderBy
            });
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getOrderById = createAsyncThunk(
    'orders/getById',
    async (orderId, thunkAPI) => {
        try {
            const response = await orderService.getOrderByIdAPI(orderId);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateOrderStatus = createAsyncThunk(
    "orders/updateStatus",
    async ({ orderId, status }, thunkAPI) => {
        try {
            const response = await orderService.updateOrderStatusAPI(orderId, status);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteOrder = createAsyncThunk(
    "orders/delete",
    async (orderId, thunkAPI) => {
        try {
            await orderService.deleteOrderAPI(orderId);
            return orderId;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

const initialState = {
    data: [],
    searchResults: [],
    currentOrder: null,
    total: 0,
    loading: false,
    error: null
};

const orderSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {
        clearSearchResults: (state) => {
            state.searchResults = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.content;
                state.total = action.payload.totalElements;
            })
            .addCase(getOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getOrdersByStatus.pending, (state) => {
                state.loading = true;
            })
            .addCase(getOrdersByStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.content;
                state.total = action.payload.totalElements;
            })
            .addCase(getOrdersByStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getOrderById.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.currentOrder = null;
            })
            .addCase(getOrderById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentOrder = action.payload;
                state.error = null;
            })
            .addCase(getOrderById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.currentOrder = null;
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                const index = state.data.findIndex((o) => o.orderId === action.payload.orderId);
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.data = state.data.filter((o) => o.orderId !== action.payload);
            })
    }
});

export const { clearSearchResults } = orderSlice.actions;
export default orderSlice.reducer; 