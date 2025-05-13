import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userService } from "../../../services/admin/userService";

/**
 * Lấy danh sách người dùng cho trang admin
 * @param {Object} params - Tham số phân trang và sắp xếp
 * @param {number} params.page - Trang hiện tại
 * @param {number} params.limit - Số lượng người dùng trên một trang
 * @param {string} params.sortBy - Trường để sắp xếp
 * @param {string} params.orderBy - Hướng sắp xếp
 * @returns {Promise<Object>} Danh sách người dùng và tổng số người dùng
 */
export const getUsers = createAsyncThunk(
    "users/getUsers",
    async ({ page, limit, sortBy, orderBy }, thunkAPI) => {
        try {
            const response = await userService.getUserAPI({
                page,
                limit,
                sortBy,
                orderBy
            });
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message || 'Không thể tải danh sách người dùng');
        }
    }
);

/**
 * Tìm kiếm người dùng theo từ khóa
 * @param {Object} params - Tham số tìm kiếm
 * @param {number} params.page - Trang hiện tại
 * @param {number} params.limit - Số lượng người dùng trên một trang
 * @param {string} params.keyword - Từ khóa tìm kiếm
 * @param {string} params.sortBy - Trường để sắp xếp
 * @param {string} params.orderBy - Hướng sắp xếp
 * @returns {Promise<Object>} Kết quả tìm kiếm và tổng số người dùng
 */
export const searchUsers = createAsyncThunk(
    'user/searchUsers',
    async ({ page = 1, limit = 10, keyword = '', sortBy, orderBy }, thunkAPI) => {
        try {
            const response = await userService.searchUserAPI({
                page,
                limit,
                keyword,
                sortBy,
                orderBy
            });
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message || 'Không thể tìm kiếm người dùng');
        }
    }
);

/**
 * Lấy thông tin chi tiết của một người dùng theo ID
 * @param {string|number} userId - ID của người dùng cần lấy thông tin
 * @returns {Promise<Object>} Thông tin chi tiết của người dùng
 */
export const getUserById = createAsyncThunk(
    'user/getById',
    async (userId, thunkAPI) => {
        try {
            const response = await userService.getUserByIdAPI(userId);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message || 'Không thể tải thông tin người dùng');
        }
    }
);

/**
 * Tạo một người dùng mới
 * @param {Object} formData - Dữ liệu người dùng cần tạo
 * @returns {Promise<Object>} Thông tin người dùng đã tạo
 */
export const createUser = createAsyncThunk(
    "users/create",
    async (formData, thunkAPI) => {
        try {
            const response = await userService.createUser(formData);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message || 'Không thể tạo người dùng mới');
        }
    }
);

/**
 * Cập nhật thông tin người dùng
 * @param {Object} params - Tham số cập nhật
 * @param {string|number} params.userId - ID của người dùng cần cập nhật
 * @param {Object} params.formData - Dữ liệu cập nhật
 * @returns {Promise<Object>} Thông tin người dùng đã cập nhật
 */
export const updateUser = createAsyncThunk(
    "users/update",
    async ({ userId, formData }, thunkAPI) => {
        try {
            const response = await userService.updateUser(userId, formData);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message || 'Không thể cập nhật thông tin người dùng');
        }
    }
);

/**
 * Xóa một người dùng
 * @param {string|number} userId - ID của người dùng cần xóa
 * @returns {Promise<string|number>} ID của người dùng đã xóa
 */
export const deleteUser = createAsyncThunk(
    "users/delete",
    async (userId, thunkAPI) => {
        try {
            const response = await userService.deleteUser(userId);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message || 'Không thể xóa người dùng');
        }
    }
);

/**
 * Cập nhật trạng thái người dùng (kích hoạt/vô hiệu hóa)
 * @param {string|number} userId - ID của người dùng cần cập nhật trạng thái
 * @returns {Promise<Object>} Thông tin người dùng đã cập nhật trạng thái
 */
export const updateUserStatus = createAsyncThunk(
    "users/updateStatus",
    async (userId, thunkAPI) => {
        try {
            const response = await userService.updateUserStatus(userId);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message || 'Không thể cập nhật trạng thái người dùng');
        }
    }
);

/**
 * Trạng thái ban đầu của user trong admin
 */
const initialState = {
    data: [],                  // Danh sách người dùng
    searchResults: [],         // Kết quả tìm kiếm
    total: 0,                  // Tổng số người dùng
    loading: false,            // Trạng thái đang tải
    error: null,               // Thông tin lỗi
};

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.content;
                state.total = action.payload.totalElements;
            })
            .addCase(getUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // search
            .addCase(searchUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(searchUsers.fulfilled, (state, action) => {
                state.searchResults = action.payload.content;
                state.total = action.payload.totalElements;
                state.loading = false;
            })
            .addCase(searchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // create
            .addCase(createUser.fulfilled, (state, action) => {
                state.data.unshift(action.payload);
            })
            // update
            .addCase(updateUser.fulfilled, (state, action) => {
                const index = state.data.findIndex((u) => u.userId === action.payload.userId);
                if (index !== -1) {
                    state.data[index] = {
                        ...state.data[index],
                        ...action.payload
                    };
                }
            })
            // delete
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.data = state.data.filter((u) => u.userId !== action.payload);
            })
            // update status
            .addCase(updateUserStatus.fulfilled, (state, action) => {
                const index = state.data.findIndex((u) => u.userId === action.payload.userId);
                if (index !== -1) state.data[index] = action.payload;
            });
    },
});
export default userSlice.reducer;