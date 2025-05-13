import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import categoryService from '../../../services/public/categoryService'

/**
 * Trạng thái ban đầu của category
 */
const initialState = {
    data: [],                // Danh sách các danh mục
    searchResults: [],       // Kết quả tìm kiếm
    currentCategory: null,   // Danh mục hiện tại đang xem
    categoryProducts: [],    // Sản phẩm trong danh mục
    loading: false,          // Trạng thái đang tải
    error: null,             // Thông tin lỗi
    total: 0                 // Tổng số danh mục/sản phẩm
}

/**
 * Hàm fetchCategories: Lấy danh sách các danh mục
 * @param {object} params - Thông số phân trang và sắp xếp
 * @param {number} params.page - Trang hiện tại
 * @param {number} params.limit - Số lượng danh mục trên một trang
 * @param {string} params.sortBy - Trường để sắp xếp
 * @param {string} params.orderBy - Hướng sắp xếp
 * @returns {Promise<object>} Danh sách các danh mục và tổng số danh mục
 */
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
/**
 * Lấy thông tin chi tiết của một danh mục theo ID
 * @param {string|number} id - ID của danh mục cần lấy thông tin
 * @returns {Promise<object>} Thông tin chi tiết của danh mục
 */
export const fetchCategoryById = createAsyncThunk(
    'category/fetchCategoryById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await categoryService.getCategoryById(id)
            return response
        } catch (error) {
            return rejectWithValue(error.message || 'Không thể tải thông tin danh mục')
        }
    }
)
/**
 * Lấy danh sách sản phẩm thuộc một danh mục
 * @param {object} params - Thông số truy vấn
 * @param {string|number} params.categoryId - ID của danh mục
 * @param {object} params.params - Tham số phân trang và sắp xếp
 * @returns {Promise<object>} Danh sách sản phẩm và tổng số sản phẩm
 */
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
            return rejectWithValue(error.message || 'Không thể tải sản phẩm')
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