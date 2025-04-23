import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import categoryService from '../../../services/public/categoryService'

const initialState = {
    data: [],
    searchResults: [],
    currentCategory: null,
    categoryProducts: [],
    loading: false,
    error: null,
    total: 0
}

export const fetchCategories = createAsyncThunk(
    'category/fetchCategories',
    async ({ page = 0, limit = 10, sortBy = 'categoryName', orderBy = 'asc' }, { rejectWithValue }) => {
        try {
            const response = await categoryService.getCategories({ page, limit, sortBy, orderBy })
            return {
                content: response.content || [],
                totalElements: response.totalElements || 0
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Không thể tải danh mục')
        }
    }
)
export const fetchCategoryById = createAsyncThunk(
    'category/fetchCategoryById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await categoryService.getCategoryById(id)
            return response
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Không thể tải thông tin danh mục')
        }
    }
)
export const fetchProductsByCategory = createAsyncThunk(
    'category/fetchProductsByCategory',
    async ({ categoryId, params }, { rejectWithValue }) => {
        try {
            const response = await categoryService.getProductsByCategory(categoryId, params)
            return {
                content: response.content || [],
                totalElements: response.totalElements || 0
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Không thể tải sản phẩm')
        }
    }
)
const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        clearCurrentCategory: (state) => {
            state.currentCategory = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload.content
                state.total = action.payload.totalElements
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(fetchCategoryById.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchCategoryById.fulfilled, (state, action) => {
                state.loading = false
                state.currentCategory = action.payload
            })
            .addCase(fetchCategoryById.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(fetchProductsByCategory.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
                state.loading = false
                state.categoryProducts = action.payload.content
                state.total = action.payload.totalElements
            })
            .addCase(fetchProductsByCategory.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    }
})

export const { clearCurrentCategory } = categorySlice.actions
export default categorySlice.reducer