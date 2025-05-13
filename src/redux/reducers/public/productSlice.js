import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import productService from '../../../services/public/productService'

/**
 * Trạng thái ban đầu của product
 */
const initialState = {
    data: [],                  // Danh sách sản phẩm
    searchResults: [],         // Kết quả tìm kiếm
    featuredProducts: [],      // Sản phẩm nổi bật
    newProducts: [],           // Sản phẩm mới
    bestSellerProducts: [],    // Sản phẩm bán chạy
    currentProduct: null,      // Sản phẩm hiện tại đang xem
    loading: false,            // Trạng thái đang tải
    error: null,               // Thông tin lỗi
    total: 0                   // Tổng số sản phẩm
}
/**
 * Lấy danh sách sản phẩm
 * @param {object} params - Tham số phân trang và sắp xếp
 * @returns {Promise<object>} Danh sách sản phẩm và tổng số sản phẩm
 */
export const fetchProducts = createAsyncThunk(
    'product/fetchProducts',
    async (params, { rejectWithValue }) => {
        try {
            const response = await productService.getProducts(params)
            return response
        } catch (error) {
            return rejectWithValue(error.message || 'Không thể tải danh sách sản phẩm')
        }
    }
)
/**
 * Lấy thông tin chi tiết của một sản phẩm theo ID
 * @param {string|number} id - ID của sản phẩm cần lấy thông tin
 * @returns {Promise<object>} Thông tin chi tiết của sản phẩm
 */
export const fetchProductById = createAsyncThunk(
    'product/fetchProductById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await productService.getProductById(id)
            return response
        } catch (error) {
            return rejectWithValue(error.message || 'Không thể tải thông tin sản phẩm')
        }
    }
)
/**
 * Lấy danh sách sản phẩm theo danh mục
 * @param {object} params - Tham số truy vấn
 * @param {string|number} params.categoryId - ID của danh mục
 * @param {object} params.params - Tham số phân trang và sắp xếp
 * @returns {Promise<object>} Danh sách sản phẩm và tổng số sản phẩm
 */
export const fetchProductsByCategory = createAsyncThunk(
    'product/fetchProductsByCategory',
    async ({ categoryId, params }, { rejectWithValue }) => {
        try {
            const response = await productService.getProductsByCategory(categoryId, params)
            return response
        } catch (error) {
            return rejectWithValue(error.message || 'Không thể tải sản phẩm theo danh mục')
        }
    }
)
/**
 * Tìm kiếm sản phẩm theo từ khóa
 * @param {object} params - Tham số tìm kiếm
 * @param {number} params.page - Trang hiện tại
 * @param {number} params.limit - Số lượng sản phẩm trên một trang
 * @param {string} params.keyword - Từ khóa tìm kiếm
 * @param {string} params.sortBy - Trường để sắp xếp
 * @param {string} params.orderBy - Hướng sắp xếp
 * @returns {Promise<object>} Kết quả tìm kiếm và tổng số sản phẩm
 */
export const fetchProductsByKeyword = createAsyncThunk(
    'product/fetchProductsByKeyword',
    async ({ page = 1, limit = 10, keyword = '', sortBy, orderBy }, { rejectWithValue }) => {
        try {
            const response = await productService.searchProducts({ page, limit, keyword, sortBy, orderBy })
            return response
        } catch (error) {
            return rejectWithValue(error.message || 'Không thể tìm kiếm sản phẩm')
        }
    }
)
/**
 * Lấy danh sách sản phẩm nổi bật
 * @param {object} params - Tham số phân trang và sắp xếp
 * @returns {Promise<object>} Danh sách sản phẩm nổi bật và tổng số sản phẩm
 */
export const fetchFeaturedProducts = createAsyncThunk(
    'product/fetchFeaturedProducts',
    async (params, { rejectWithValue }) => {
        try {
            const response = await productService.getFeaturedProducts(params)
            return response
        } catch (error) {
            return rejectWithValue(error.message || 'Không thể tải sản phẩm nổi bật')
        }
    }
)
/**
 * Lấy danh sách sản phẩm mới
 * @param {object} params - Tham số phân trang và sắp xếp
 * @returns {Promise<object>} Danh sách sản phẩm mới và tổng số sản phẩm
 */
export const fetchNewProducts = createAsyncThunk(
    'product/fetchNewProducts',
    async (params, { rejectWithValue }) => {
        try {
            const response = await productService.getNewProducts(params)
            return response
        } catch (error) {
            return rejectWithValue(error.message || 'Không thể tải sản phẩm mới')
        }
    }
)
/**
 * Lấy danh sách sản phẩm bán chạy
 * @param {object} params - Tham số phân trang và sắp xếp
 * @returns {Promise<object>} Danh sách sản phẩm bán chạy và tổng số sản phẩm
 */
export const fetchBestSellerProducts = createAsyncThunk(
    'product/fetchBestSellerProducts',
    async (params, { rejectWithValue }) => {
        try {
            const response = await productService.getBestSellerProducts(params)
            return response
        } catch (error) {
            return rejectWithValue(error.message || 'Không thể tải sản phẩm bán chạy')
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
