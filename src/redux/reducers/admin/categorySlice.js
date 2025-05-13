import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import categoryService from '../../../services/admin/categoryService'

/**
 * Trạng thái ban đầu của category trong admin
 */
const initialState = {
  data: [],                  // Danh sách các danh mục
  searchResults: [],         // Kết quả tìm kiếm
  currentCategory: null,     // Danh mục hiện tại đang xem/chỉnh sửa
  categoryProducts: [],      // Sản phẩm trong danh mục
  loading: false,            // Trạng thái đang tải
  error: null,               // Thông tin lỗi
  total: 0                   // Tổng số danh mục
}

/**
 * Lấy danh sách danh mục cho trang admin
 * @param {Object} params - Tham số phân trang và sắp xếp
 * @returns {Promise<Object>} Danh sách danh mục và tổng số danh mục
 */
export const getCategories = createAsyncThunk(
    'category/getCategories',
    async (params, { rejectWithValue }) => {
        try {
            const response = await categoryService.getCategoryAPI(params)
            return response
        } catch (error) {
            return rejectWithValue(error.message || 'Không thể tải danh sách danh mục')
        }
    }
)
  
/**
 * Tìm kiếm danh mục theo từ khóa
 * @param {Object} params - Tham số tìm kiếm
 * @param {number} params.page - Trang hiện tại
 * @param {number} params.limit - Số lượng danh mục trên một trang
 * @param {string} params.keyword - Từ khóa tìm kiếm
 * @param {string} params.sortBy - Trường để sắp xếp
 * @param {string} params.orderBy - Hướng sắp xếp
 * @returns {Promise<Object>} Kết quả tìm kiếm và tổng số danh mục
 */
export const searchCategories = createAsyncThunk(
    'category/searchCategories',
    async ({ page = 1, limit = 10, keyword = '', sortBy, orderBy }, { rejectWithValue }) => {
        try {
            const response = await categoryService.searchCategoryAPI({ page, limit, keyword, sortBy, orderBy })
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Không thể tìm kiếm danh mục')
        }
    }
)
  
/**
 * Lấy thông tin chi tiết của một danh mục theo ID
 * @param {string|number} id - ID của danh mục cần lấy thông tin
 * @returns {Promise<Object>} Thông tin chi tiết của danh mục
 */
export const getCategoryById = createAsyncThunk(
    'category/getCategoryById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await categoryService.getCategoryByIdAPI(id)
            return response
        } catch (error) {
            return rejectWithValue(error.message || 'Không thể tải thông tin danh mục')
        }
    }
)
  
/**
 * Tạo một danh mục mới
 * @param {Object} data - Dữ liệu danh mục cần tạo
 * @returns {Promise<Object>} Thông tin danh mục đã tạo
 */
export const createCategory = createAsyncThunk(
    'category/createCategory',
    async (data, { rejectWithValue }) => {
        try {
            const response = await categoryService.createCategory(data)
            return response
        } catch (error) {
            return rejectWithValue(error.message || 'Không thể tạo danh mục mới')
        }
    }
)
  
/**
 * Cập nhật thông tin danh mục
 * @param {Object} params - Tham số cập nhật
 * @param {string|number} params.id - ID của danh mục cần cập nhật
 * @param {Object} params.data - Dữ liệu cập nhật
 * @returns {Promise<Object>} Thông tin danh mục đã cập nhật
 */
export const updateCategory = createAsyncThunk(
    'category/updateCategory',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await categoryService.updateCategory(id, data)
            return response
        } catch (error) {
            return rejectWithValue(error.message || 'Không thể cập nhật danh mục')
        }
    }
)
  
/**
 * Xóa một danh mục
 * @param {string|number} id - ID của danh mục cần xóa
 * @returns {Promise<string|number>} ID của danh mục đã xóa
 */
export const deleteCategory = createAsyncThunk(
    'category/deleteCategory',
    async (id, { rejectWithValue }) => {
        try {
            await categoryService.deleteCategory(id)
            return id
        } catch (error) {
            return rejectWithValue(error.message || 'Không thể xóa danh mục')
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
