import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { reportService } from "../../../services/admin/reportService";

/**
 * Lấy dữ liệu doanh thu bán hàng theo thời gian
 * @param {Object} params - Tham số thời gian
 * @param {string|Date} params.from - Ngày bắt đầu
 * @param {string|Date} params.to - Ngày kết thúc
 * @returns {Promise<Array>} Dữ liệu doanh thu theo thời gian
 */
export const getSalesRevenueOverTime = createAsyncThunk(
    "reports/salesRevenue",
    async ({ from, to }, thunkAPI) => {
        try {
            const response = await reportService.getSalesRevenueOverTime(from, to);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message || 'Không thể tải dữ liệu doanh thu');
        }
    }
);

/**
 * Lấy danh sách sản phẩm bán chạy nhất
 * @param {Object} params - Tham số thời gian
 * @param {string|Date} params.from - Ngày bắt đầu
 * @param {string|Date} params.to - Ngày kết thúc
 * @returns {Promise<Array>} Danh sách sản phẩm bán chạy
 */
export const getBestSellerProducts = createAsyncThunk(
    "reports/bestSellerProducts",
    async ({ from, to }, thunkAPI) => {
        try {
            const response = await reportService.getBestSellerProducts(from, to);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message || 'Không thể tải danh sách sản phẩm bán chạy');
        }
    }
);

/**
 * Lấy danh sách sản phẩm được thích nhiều nhất
 * @param {Object} params - Tham số thời gian
 * @param {string|Date} params.from - Ngày bắt đầu
 * @param {string|Date} params.to - Ngày kết thúc
 * @returns {Promise<Array>} Danh sách sản phẩm được thích nhiều nhất
 */
export const getMostLikedProducts = createAsyncThunk(
    "reports/mostLikedProducts",
    async ({ from, to }, thunkAPI) => {
        try {
            const response = await reportService.getMostLikedProducts(from, to);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message || 'Không thể tải danh sách sản phẩm được thích nhiều nhất');
        }
    }
);

/**
 * Lấy dữ liệu doanh thu theo danh mục
 * @param {Object} params - Tham số thời gian
 * @returns {Promise<Array>} Dữ liệu doanh thu theo danh mục
 */
export const getRevenueByCategory = createAsyncThunk(
    "reports/revenueByCategory",
    async (params, thunkAPI) => {
        try {
            const response = await reportService.getRevenueByCategory(params);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message || 'Không thể tải dữ liệu doanh thu theo danh mục');
        }
    }
);

/**
 * Lấy danh sách khách hàng chi tiêu nhiều nhất
 * @param {Object} params - Tham số thời gian
 * @param {string|Date} params.from - Ngày bắt đầu
 * @param {string|Date} params.to - Ngày kết thúc
 * @returns {Promise<Array>} Danh sách khách hàng chi tiêu nhiều nhất
 */
export const getTopSpendingCustomers = createAsyncThunk(
    "reports/topSpendingCustomers",
    async ({ from, to }, thunkAPI) => {
        try {
            const response = await reportService.getTopSpendingCustomers(from, to);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message || 'Không thể tải danh sách khách hàng chi tiêu nhiều nhất');
        }
    }
);

/**
 * Lấy số lượng tài khoản mới đăng ký trong tháng
 * @param {Object} params - Tham số thời gian
 * @param {number} params.month - Tháng cần thống kê
 * @param {number} params.year - Năm cần thống kê
 * @returns {Promise<Array>} Dữ liệu tài khoản mới đăng ký
 */
export const getNewAccountsThisMonth = createAsyncThunk(
    "reports/newAccounts",
    async ({ month, year }, thunkAPI) => {
        try {
            const response = await reportService.getNewAccountsThisMonth(month, year);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message || 'Không thể tải dữ liệu tài khoản mới');
        }
    }
);

/**
 * Lấy dữ liệu hóa đơn theo thời gian
 * @param {Object} params - Tham số thời gian
 * @param {string|Date} params.from - Ngày bắt đầu
 * @param {string|Date} params.to - Ngày kết thúc
 * @returns {Promise<Array>} Dữ liệu hóa đơn theo thời gian
 */
export const getInvoicesOverTime = createAsyncThunk(
    "reports/invoicesOverTime",
    async ({ from, to }, thunkAPI) => {
        try {
            const response = await reportService.getInvoicesOverTime(from, to);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message || 'Không thể tải dữ liệu hóa đơn');
        }
    }
);

/**
 * Trạng thái ban đầu của report trong admin
 */
const initialState = {
    salesRevenue: [],          // Dữ liệu doanh thu bán hàng theo thời gian
    bestSellerProducts: [],    // Danh sách sản phẩm bán chạy nhất
    mostLikedProducts: [],     // Danh sách sản phẩm được thích nhiều nhất
    revenueByCategory: [],     // Dữ liệu doanh thu theo danh mục
    topSpendingCustomers: [],  // Danh sách khách hàng chi tiêu nhiều nhất
    newAccounts: [],           // Dữ liệu tài khoản mới đăng ký
    invoicesOverTime: [],      // Dữ liệu hóa đơn theo thời gian
    loading: false,            // Trạng thái đang tải
    error: null                // Thông tin lỗi
};

const reportSlice = createSlice({
    name: "reports",
    initialState,
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