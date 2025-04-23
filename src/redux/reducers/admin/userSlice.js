import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userService } from "../../../services/admin/userService";

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
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

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
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getUserById = createAsyncThunk(
    'user/getById',
    async (userId) => {
        const response = await userService.getUserByIdAPI(userId);
        return response;
    }
);

export const createUser = createAsyncThunk(
    "users/create",
    async (formData, thunkAPI) => {
        try {
            const response = await userService.createUser(formData);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateUser = createAsyncThunk(
    "users/update",
    async ({ userId, formData }, thunkAPI) => {
        try {
            const response = await userService.updateUser(userId, formData);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteUser = createAsyncThunk(
    "users/delete",
    async (userId, thunkAPI) => {
        try {
            const response = await userService.deleteUser(userId);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateUserStatus = createAsyncThunk(
    "users/updateStatus",
    async (userId, thunkAPI) => {
        try {
            const response = await userService.updateUserStatus(userId);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

const userSlice = createSlice({
    name: "users",
    initialState: {
        data: [],
        searchResults: [],
        total: 0,
        loading: false,
        error: null,
    },
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