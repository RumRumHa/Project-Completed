import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import productService from '../../../services/public/productService'

const initialState = {
    data: [],
    searchResults: [],
    featuredProducts: [],
    newProducts: [],
    bestSellerProducts: [],
    currentProduct: null,
    loading: false,
    error: null,
    total: 0
}
export const fetchProducts = createAsyncThunk(
    'product/fetchProducts',
    async (params, { rejectWithValue }) => {
        try {
            const response = await productService.getProducts(params)
            return response
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)
export const fetchProductById = createAsyncThunk(
    'product/fetchProductById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await productService.getProductById(id)
            return response
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)
export const fetchProductsByCategory = createAsyncThunk(
    'product/fetchProductsByCategory',
    async ({ categoryId, params }, { rejectWithValue }) => {
        try {
            const response = await productService.getProductsByCategory(categoryId, params)
            return response
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)
export const fetchProductsByKeyword = createAsyncThunk(
    'product/fetchProductsByKeyword',
    async ({ page = 1, limit = 10, keyword = '', sortBy, orderBy }, { rejectWithValue }) => {
        try {
            const response = await productService.searchProducts({ page, limit, keyword, sortBy, orderBy })
            return response
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)
export const fetchFeaturedProducts = createAsyncThunk(
    'product/fetchFeaturedProducts',
    async (params, { rejectWithValue }) => {
        try {
            const response = await productService.getFeaturedProducts(params)
            return response
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)
export const fetchNewProducts = createAsyncThunk(
    'product/fetchNewProducts',
    async (params, { rejectWithValue }) => {
        try {
            const response = await productService.getNewProducts(params)
            return response
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)
export const fetchBestSellerProducts = createAsyncThunk(
    'product/fetchBestSellerProducts',
    async (params, { rejectWithValue }) => {
        try {
            const response = await productService.getBestSellerProducts(params)
            return response
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)
const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        clearCurrentProduct: (state) => {
            state.currentProduct = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload.content || []
                state.total = action.payload.totalElements || 0
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(fetchProductById.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.loading = false
                state.currentProduct = action.payload
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(fetchProductsByCategory.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload.content
                state.total = action.payload.totalElements
            })
            .addCase(fetchProductsByCategory.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(fetchProductsByKeyword.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchProductsByKeyword.fulfilled, (state, action) => {
                state.loading = false
                state.searchResults = action.payload.content
                state.total = action.payload.totalElements
            })
            .addCase(fetchProductsByKeyword.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(fetchFeaturedProducts.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
                state.loading = false
                state.featuredProducts = action.payload.content
                state.total = action.payload.totalElements
            })
            .addCase(fetchFeaturedProducts.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(fetchNewProducts.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchNewProducts.fulfilled, (state, action) => {
                state.loading = false
                state.newProducts = action.payload.content
                state.total = action.payload.totalElements
            })
            .addCase(fetchNewProducts.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(fetchBestSellerProducts.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchBestSellerProducts.fulfilled, (state, action) => {
                state.loading = false
                state.bestSellerProducts = action.payload.content
                state.total = action.payload.totalElements
            })
            .addCase(fetchBestSellerProducts.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    }
})

export const { clearCurrentProduct } = productSlice.actions
export default productSlice.reducer
