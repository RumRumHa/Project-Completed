import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../../services/public/authService";

/**
 * Đăng nhập người dùng
 * @param {Object} credentials - Thông tin đăng nhập (username, password)
 */
export const login = createAsyncThunk(
    "auth/login",
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await authService.login(credentials);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Đăng nhập thất bại');
        }
    }
);

/**
 * Đăng ký tài khoản mới
 * @param {Object} userData - Thông tin người dùng đăng ký
 */
export const register = createAsyncThunk(
    "auth/register",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await authService.register(userData);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Đăng ký thất bại');
        }
    }
);

/**
 * Đổi mật khẩu người dùng
 * @param {Object} passwordData - Dữ liệu mật khẩu (oldPass, newPass, confirmNewPass)
 */
export const changePassword = createAsyncThunk(
    "auth/changePassword",
    async (passwordData, { rejectWithValue }) => {
        try {
            const response = await authService.changePassword(passwordData);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Đổi mật khẩu thất bại');
        }
    }
);

/**
 * Trạng thái ban đầu của auth
 */
const initialState = {
    token: authService.getToken(),
    user: authService.getCurrentUser(),
    roles: authService.getRoles(),
    loading: false,
    error: null,
    registerSuccess: false,
    passwordChangeSuccess: false
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            authService.logout();
            state.token = null;
            state.user = null;
            state.roles = [];
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        clearRegisterSuccess: (state) => {
            state.registerSuccess = false;
        },
        clearPasswordChangeSuccess: (state) => {
            state.passwordChangeSuccess = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.roles = action.payload.roles;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.registerSuccess = false;
            })
            .addCase(register.fulfilled, (state) => {
                state.loading = false;
                state.registerSuccess = true;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.registerSuccess = false;
            })
            .addCase(changePassword.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.passwordChangeSuccess = false;
            })
            .addCase(changePassword.fulfilled, (state) => {
                state.loading = false;
                state.passwordChangeSuccess = true;
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.passwordChangeSuccess = false;
            });
    }
});

export const { logout, clearError, clearRegisterSuccess, clearPasswordChangeSuccess } = authSlice.actions;
export default authSlice.reducer;