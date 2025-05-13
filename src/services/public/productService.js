import { publicApi } from '../../services/baseApiService';

const productService = {
    // Lấy danh sách sản phẩm với phân trang và sắp xếp
    getProducts: async (params = {}) => {
        const defaultParams = {
            page: 1,
            limit: 10,
            sortBy: "productName",
            orderBy: "asc"
        };
        return publicApi.get('/products', { ...defaultParams, ...params });
    },

    // Lấy sản phẩm theo ID
    getProductById: async (id) => {
        return publicApi.getById('/products', id);
    },

    // Lấy sản phẩm theo danh mục
    getProductsByCategory: async (categoryId, params = {}) => {
        const defaultParams = {
            page: 1,
            limit: 10,
            sortBy: "productName",
            orderBy: "asc"
        };
        return publicApi.get(`/products/categories/${categoryId}`, { ...defaultParams, ...params });
    },

    // Tìm kiếm sản phẩm
    searchProducts: async (params = {}) => {
        const defaultParams = {
            page: 1,
            limit: 10,
            keyword: "",
            sortBy: "productName",
            orderBy: "asc"
        };
        return publicApi.get('/products/search', { ...defaultParams, ...params });
    },

    // Lấy sản phẩm nổi bật
    getFeaturedProducts: async (params = {}) => {
        const defaultParams = {
            page: 1,
            limit: 10,
            sortBy: "productName",
            orderBy: "asc"
        };
        return publicApi.get('/products/featured-products', { ...defaultParams, ...params });
    },

    // Lấy sản phẩm mới
    getNewProducts: async (params = {}) => {
        const defaultParams = {
            page: 1,
            limit: 10,
            sortBy: "createdAt",
            orderBy: "desc"
        };
        return publicApi.get('/products/new-products', { ...defaultParams, ...params });
    },

    // Lấy sản phẩm bán chạy
    getBestSellerProducts: async (params = {}) => {
        const defaultParams = {
            page: 1,
            limit: 10,
            sortBy: "productName",
            orderBy: "asc"
        };
        return publicApi.get('/products/best-seller-products', { ...defaultParams, ...params });
    }
};

export default productService;