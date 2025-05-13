import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import orderService from "../../../services/admin/orderService";

/**
 * Lấy danh sách đơn hàng cho trang admin
 * @param {Object} params - Tham số truy vấn
 * @param {number} params.page - Trang hiện tại
 * @param {number} params.limit - Số lượng đơn hàng trên một trang
 * @param {string} params.sortBy - Trường để sắp xếp
 * @param {string} params.orderBy - Hướng sắp xếp
 * @param {string} params.status - Trạng thái đơn hàng
 * @returns {Promise<Object>} Danh sách đơn hàng và tổng số đơn hàng
 */
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
            return thunkAPI.rejectWithValue(error.message || 'Không thể tải danh sách đơn hàng');
        }
    }
);

/**
 * Lấy danh sách đơn hàng theo trạng thái
 * @param {Object} params - Tham số truy vấn
 * @param {string} params.status - Trạng thái đơn hàng cần lọc
 * @param {number} params.page - Trang hiện tại
 * @param {number} params.limit - Số lượng đơn hàng trên một trang
 * @param {string} params.sortBy - Trường để sắp xếp
 * @param {string} params.orderBy - Hướng sắp xếp
 * @returns {Promise<Object>} Danh sách đơn hàng và tổng số đơn hàng
 */
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
            return thunkAPI.rejectWithValue(error.message || 'Không thể tải đơn hàng theo trạng thái');
        }
    }
);

/**
 * Lấy thông tin chi tiết của một đơn hàng theo ID
 * @param {string|number} orderId - ID của đơn hàng cần lấy thông tin
 * @returns {Promise<Object>} Thông tin chi tiết của đơn hàng
 */
export const getOrderById = createAsyncThunk(
    'orders/getById',
    async (orderId, thunkAPI) => {
        try {
            const response = await orderService.getOrderByIdAPI(orderId);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message || 'Không thể tải thông tin đơn hàng');
        }
    }
);

/**
 * Cập nhật trạng thái đơn hàng
 * @param {Object} params - Tham số cập nhật
 * @param {string|number} params.orderId - ID của đơn hàng cần cập nhật
 * @param {string} params.status - Trạng thái mới của đơn hàng
 * @returns {Promise<Object>} Thông tin đơn hàng đã cập nhật
 */
export const updateOrderStatus = createAsyncThunk(
    "orders/updateStatus",
    async ({ orderId, status }, thunkAPI) => {
        try {
            const response = await orderService.updateOrderStatusAPI(orderId, status);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message || 'Không thể cập nhật trạng thái đơn hàng');
        }
    }
);

/**
 * Xóa một đơn hàng
 * @param {string|number} orderId - ID của đơn hàng cần xóa
 * @returns {Promise<string|number>} ID của đơn hàng đã xóa
 */
export const deleteOrder = createAsyncThunk(
    "orders/delete",
    async (orderId, thunkAPI) => {
        try {
            await orderService.deleteOrderAPI(orderId);
            return orderId;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message || 'Không thể xóa đơn hàng');
        }
    }
);

/**
 * Trạng thái ban đầu của order trong admin
 */
const initialState = {
    data: [],                  // Danh sách đơn hàng
    searchResults: [],         // Kết quả tìm kiếm
    currentOrder: null,        // Đơn hàng hiện tại đang xem/chỉnh sửa
    total: 0,                  // Tổng số đơn hàng
    loading: false,            // Trạng thái đang tải
    error: null                // Thông tin lỗi
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