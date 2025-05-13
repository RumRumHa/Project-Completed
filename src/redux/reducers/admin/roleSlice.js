import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { roleService } from "../../../services/admin/roleService";

/**
 * Lấy danh sách các vai trò trong hệ thống
 * @returns {Promise<Array>} Danh sách các vai trò
 */
export const getRoles = createAsyncThunk(
    "roles/getRoles",
    async (_, thunkAPI) => {
        try {
            const response = await roleService.getRolesAPI();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message || 'Không thể tải danh sách vai trò');
        }
    }
);

/**
 * Thêm vai trò cho người dùng
 * @param {Object} params - Tham số 
 * @param {string|number} params.userId - ID của người dùng
 * @param {string|number} params.roleId - ID của vai trò
 * @returns {Promise<Object>} Kết quả thêm vai trò
 */
export const addRoleToUser = createAsyncThunk(
    "roles/addRoleToUser",
    async ({ userId, roleId }, thunkAPI) => {
        try {
            const response = await roleService.addRoleToUserAPI(userId, roleId);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message || 'Không thể thêm vai trò cho người dùng');
        }
    }
);

/**
 * Xóa vai trò khỏi người dùng
 * @param {Object} params - Tham số 
 * @param {string|number} params.userId - ID của người dùng
 * @param {string|number} params.roleId - ID của vai trò
 * @returns {Promise<Object>} Kết quả xóa vai trò
 */
export const removeRoleFromUser = createAsyncThunk(
    "roles/removeRoleFromUser",
    async ({ userId, roleId }, thunkAPI) => {
        try {
            const response = await roleService.removeRoleFromUserAPI(userId, roleId);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message || 'Không thể xóa vai trò khỏi người dùng');
        }
    }
);

/**
 * Trạng thái ban đầu của role trong admin
 */
const initialState = {
    data: [],                  // Danh sách các vai trò
    loading: false,            // Trạng thái đang tải
    error: null,               // Thông tin lỗi
};

const roleSlice = createSlice({
    name: "roles",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getRoles.pending, (state) => {
                state.loading = true;
            })
            .addCase(getRoles.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(getRoles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
        });
    },
});

export default roleSlice.reducer; 