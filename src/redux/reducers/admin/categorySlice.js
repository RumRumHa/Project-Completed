import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import categoryService from '../../../services/admin/categoryService'

const initialState = {
  data: [],
  searchResults: [],
  currentCategory: null,
  categoryProducts: [],
  loading: false,
  error: null,
  total: 0
}

export const getCategories = createAsyncThunk(
    'category/getCategories',
    async (params, { rejectWithValue }) => {
        try {
            const response = await categoryService.getCategoryAPI(params)
            return response
        } catch (error) {
            return rejectWithValue(error.response.data || error.message)
        }
    }
)
  
export const searchCategories = createAsyncThunk(
'category/searchCategories',
async ({ page = 1, limit = 10, keyword = '', sortBy, orderBy }, { rejectWithValue }) => {
    try {
    const response = await categoryService.searchCategoryAPI({ page, limit, keyword, sortBy, orderBy })
    return response;
    } catch (error) {
    return rejectWithValue(error.response?.data || error.message)
    }
}
)
  
export const getCategoryById = createAsyncThunk(
'category/getCategoryById',
async (id, { rejectWithValue }) => {
    try {
        const response = await categoryService.getCategoryByIdAPI(id)
        return response
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message)
    }
}
)
  
export const createCategory = createAsyncThunk(
'category/createCategory',
async (data, { rejectWithValue }) => {
    try {
    const response = await categoryService.createCategory(data)
    return response
    } catch (error) {
    return rejectWithValue(error.response?.data || error.message)
    }
}
)
  
export const updateCategory = createAsyncThunk(
'category/updateCategory',
async ({ id, data }, { rejectWithValue }) => {
    try {
    const response = await categoryService.updateCategory(id, data)
    return response
    } catch (error) {
    return rejectWithValue(error.response?.data || error.message)
    }
}
)
  
export const deleteCategory = createAsyncThunk(
    'category/deleteCategory',
    async (id, { rejectWithValue }) => {
    try {
        await categoryService.deleteCategory(id)
        return id
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message)
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
            .addCase(getCategories.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getCategories.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload.content
                state.total = action.payload.totalElements
            })
            .addCase(getCategories.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(searchCategories.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(searchCategories.fulfilled, (state, action) => {
                state.loading = false
                state.searchResults = action.payload.content
                state.total = action.payload.totalElements
            })
            .addCase(searchCategories.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(getCategoryById.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getCategoryById.fulfilled, (state, action) => {
                state.loading = false
                state.currentCategory = action.payload
            })
            .addCase(getCategoryById.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(createCategory.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.loading = false
                state.data.unshift(action.payload)
                state.total += 1
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(updateCategory.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.loading = false
                const index = state.data.findIndex(c => c.categoryId === action.payload.categoryId)
                if (index !== -1) {
                    state.data[index] = action.payload
                }
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(deleteCategory.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.loading = false
                state.data = state.data.filter(c => c.categoryId !== action.payload)
                state.total -= 1
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    }
})

export default categorySlice.reducer;
