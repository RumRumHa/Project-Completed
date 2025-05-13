import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import productService from '../../../services/admin/productService'

/**
 * Trạng thái ban đầu của product trong admin
 */
const initialState = {
    data: [],                  // Danh sách sản phẩm
    searchResults: [],         // Kết quả tìm kiếm
    currentProduct: null,      // Sản phẩm hiện tại đang xem/chỉnh sửa
    loading: false,            // Trạng thái đang tải
    error: null,               // Thông tin lỗi
    total: 0                   // Tổng số sản phẩm
}

/**
 * Lấy danh sách sản phẩm cho trang admin
 * @param {Object} params - Tham số phân trang và sắp xếp
 * @param {number} params.page - Trang hiện tại
 * @param {number} params.limit - Số lượng sản phẩm trên một trang
 * @param {string} params.sortBy - Trường để sắp xếp
 * @param {string} params.orderBy - Hướng sắp xếp
 * @returns {Promise<Object>} Danh sách sản phẩm và tổng số sản phẩm
 */
export const getProducts = createAsyncThunk(
    'product/getProducts',
    async ({ page = 1, limit = 10, sortBy, orderBy }, { rejectWithValue }) => {
        try {
            const response = await productService.getProductAPI({ page, limit, sortBy, orderBy })
            return response
        } catch (error) {
            return rejectWithValue(error.message || 'Không thể tải danh sách sản phẩm')
        }
    }
)

/**
 * Tìm kiếm sản phẩm theo từ khóa
 * @param {Object} params - Tham số tìm kiếm
 * @param {number} params.page - Trang hiện tại
 * @param {number} params.limit - Số lượng sản phẩm trên một trang
 * @param {string} params.keyword - Từ khóa tìm kiếm
 * @param {string} params.sortBy - Trường để sắp xếp
 * @param {string} params.orderBy - Hướng sắp xếp
 * @returns {Promise<Object>} Kết quả tìm kiếm và tổng số sản phẩm
 */
export const searchProducts = createAsyncThunk(
    'product/searchProducts',
    async ({ page = 1, limit = 10, keyword = '', sortBy, orderBy }, { rejectWithValue }) => {
        try {
            const response = await productService.searchProductAPI({ page, limit, keyword, sortBy, orderBy })
            return response
        } catch (error) {
            return rejectWithValue(error.message || 'Không thể tìm kiếm sản phẩm')
        }
    }
)



/**
 * Lấy thông tin chi tiết của một sản phẩm theo ID
 * @param {string|number} id - ID của sản phẩm cần lấy thông tin
 * @returns {Promise<Object>} Thông tin chi tiết của sản phẩm
 */
export const getProductById = createAsyncThunk(
    'product/getProductById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await productService.getProductByIdAPI(id)
            return response
        } catch (error) {
            return rejectWithValue(error.message || 'Không thể tải thông tin sản phẩm')
        }
    }
)

/**
 * Tạo một sản phẩm mới
 * @param {FormData} formData - Dữ liệu sản phẩm dạng FormData
 * @returns {Promise<Object>} Thông tin sản phẩm đã tạo
 */
export const createProduct = createAsyncThunk(
    'product/createProduct',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await productService.createProduct(formData)
            return response
        } catch (error) {
            return rejectWithValue(error.message || 'Không thể tạo sản phẩm mới')
        }
    }
)

/**
 * Cập nhật thông tin sản phẩm
 * @param {Object} params - Tham số cập nhật
 * @param {string|number} params.id - ID của sản phẩm cần cập nhật
 * @param {FormData} params.formData - Dữ liệu cập nhật dạng FormData
 * @returns {Promise<Object>} Thông tin sản phẩm đã cập nhật
 */
export const updateProduct = createAsyncThunk(
    'product/updateProduct',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await productService.updateProduct(id, formData)
            return response
        } catch (error) {
            return rejectWithValue(error.message || 'Không thể cập nhật sản phẩm')
        }
    }
)

/**
 * Xóa một sản phẩm
 * @param {string|number} id - ID của sản phẩm cần xóa
 * @returns {Promise<string|number>} ID của sản phẩm đã xóa
 */
export const deleteProduct = createAsyncThunk(
    'product/deleteProduct',
    async (id, { rejectWithValue }) => {
        try {
            await productService.deleteProduct(id)
            return id
        } catch (error) {
            return rejectWithValue(error.message || 'Không thể xóa sản phẩm')
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