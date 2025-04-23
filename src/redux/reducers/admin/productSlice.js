import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import productService from '../../../services/admin/productService'

const initialState = {
    data: [],
    searchResults: [],
    currentProduct: null,
    loading: false,
    error: null,
    total: 0
}

export const getProducts = createAsyncThunk(
    'product/getProducts',
    async ({ page = 1, limit = 10, sortBy, orderBy }, { rejectWithValue }) => {
        try {
            const response = await productService.getProductAPI({ page, limit, sortBy, orderBy })
            return response
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const searchProducts = createAsyncThunk(
    'product/searchProducts',
    async ({ page = 1, limit = 10, keyword = '', sortBy, orderBy }, { rejectWithValue }) => {
        try {
            const response = await productService.searchProductAPI({ page, limit, keyword, sortBy, orderBy })
            return response
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)



export const getProductById = createAsyncThunk(
    'product/getProductById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await productService.getProductByIdAPI(id)
            return response
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const createProduct = createAsyncThunk(
    'product/createProduct',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await productService.createProduct(formData)
            return response
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const updateProduct = createAsyncThunk(
    'product/updateProduct',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await productService.updateProduct(id, formData)
            return response
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const deleteProduct = createAsyncThunk(
    'product/deleteProduct',
    async (id, { rejectWithValue }) => {
        try {
            await productService.deleteProduct(id)
            return id
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
            .addCase(getProducts.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload.content || []
                state.total = action.payload.totalElements || 0
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(searchProducts.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(searchProducts.fulfilled, (state, action) => {
                state.loading = false
                state.searchResults = action.payload.content
                state.total = action.payload.totalElements
            })
            .addCase(searchProducts.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(getProductById.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getProductById.fulfilled, (state, action) => {
                state.loading = false
                state.currentProduct = action.payload
            })
            .addCase(getProductById.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(createProduct.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false
                state.data.unshift(action.payload)
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(updateProduct.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false
                const index = state.data.findIndex(p => p.productId === action.payload.productId)
                if (index !== -1) {
                    state.data[index] = action.payload
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false
                state.data = state.data.filter(p => p.productId !== action.payload)
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    }
})

export const { clearCurrentProduct } = productSlice.actions
export default productSlice.reducer