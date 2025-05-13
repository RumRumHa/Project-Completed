import { publicApi } from '../../services/baseApiService';

/**
 * Dịch vụ quản lý danh mục cho phần công khai
 */
const categoryService = {
    /**
     * Lấy danh sách danh mục với phân trang và sắp xếp
     * @param {Object} params - Các tham số truy vấn
     * @returns {Promise<any>} Danh sách danh mục
     */
    getCategories: async (params = {}) => {
        try {
            const defaultParams = {
                page: 0,
                limit: 10,
                sortBy: 'categoryName',
                orderBy: 'asc'
            };
            // Sử dụng tham số rỗng cho params thứ 2 và truyền các tham số vào config
            return publicApi.get('/categories', {}, {
                params: { ...defaultParams, ...params }
            });
        } catch (error) {
            console.error('Lỗi khi lấy danh sách danh mục:', error);
            throw error;
        }
    },
    
    /**
     * Lấy danh mục theo ID
     * @param {string|number} id - ID của danh mục
     * @returns {Promise<any>} Thông tin danh mục
     */
    getCategoryById: async (id) => {
        try {
            return publicApi.getById('/categories', id);
        } catch (error) {
            console.error(`Lỗi khi lấy danh mục với ID ${id}:`, error);
            throw error;
        }
    },
    
    /**
     * Lấy sản phẩm theo danh mục
     * @param {string|number} categoryId - ID của danh mục
     * @param {Object} params - Các tham số truy vấn
     * @returns {Promise<any>} Danh sách sản phẩm thuộc danh mục
     */
    getProductsByCategory: async (categoryId, params = {}) => {
        try {
            const defaultParams = {
                page: 1,
                limit: 10,
                sortBy: "productName",
                orderBy: "asc"
            };
            // Sử dụng tham số rỗng cho params thứ 2 và truyền các tham số vào config
            return publicApi.get(`/categories/${categoryId}/products`, {}, {
                params: { ...defaultParams, ...params }
            });
        } catch (error) {
            console.error(`Lỗi khi lấy sản phẩm theo danh mục ${categoryId}:`, error);
            throw error;
        }
    }
};

export default categoryService;
