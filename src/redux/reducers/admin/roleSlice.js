import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { roleService } from "../../../services/admin/roleService";

export const getRoles = createAsyncThunk(
    "roles/getRoles",
    async (_, thunkAPI) => {
        try {
            const response = await roleService.getRolesAPI();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const addRoleToUser = createAsyncThunk(
    "roles/addRoleToUser",
    async ({ userId, roleId }, thunkAPI) => {
        try {
            const response = await roleService.addRoleToUserAPI(userId, roleId);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const removeRoleFromUser = createAsyncThunk(
    "roles/removeRoleFromUser",
    async ({ userId, roleId }, thunkAPI) => {
        try {
            const response = await roleService.removeRoleFromUserAPI(userId, roleId);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

const roleSlice = createSlice({
    name: "roles",
    initialState: {
        data: [],
        loading: false,
        error: null,
    },
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