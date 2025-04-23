import { BASE_URL } from '../../api'

const productService = {
    getProducts: async ({ page = 1, limit = 10, sortBy = "productName", orderBy = "asc" }) => {
        let url = `/products?page=${page - 1}&limit=${limit}`
        if (sortBy && orderBy) {
            url += `&sortBy=${sortBy}&orderBy=${orderBy}`
        }
        const res = await BASE_URL.get(url)
        return res.data
    },

    getProductById: async (id) => {
        const res = await BASE_URL.get(`/products/${id}`)
        return res.data
    },

    getProductsByCategory: async (categoryId, { page = 1, limit = 10, sortBy = "productName", orderBy = "asc" }) => {
        let url = `/products/categories/${categoryId}?page=${page - 1}&limit=${limit}`
        if (sortBy && orderBy) {
            url += `&sortBy=${sortBy}&orderBy=${orderBy}`
        }
        const res = await BASE_URL.get(url)
        return res.data
    },

    searchProducts: async ({ page = 1, limit = 10, keyword = "", sortBy = "productName", orderBy = "asc" }) => {
        let url = `/products/search?keyword=${keyword}&page=${page - 1}&limit=${limit}`
        if (sortBy && orderBy) {
            url += `&sortBy=${sortBy}&orderBy=${orderBy}`
        }
        const res = await BASE_URL.get(url)
        return res.data
    },

    getFeaturedProducts: async ({ page = 1, limit = 10, sortBy = "productName", orderBy = "asc" }) => {
        let url = `/products/featured-products?page=${page - 1}&limit=${limit}`
        if (sortBy && orderBy) {
            url += `&sortBy=${sortBy}&orderBy=${orderBy}`
        }
        const res = await BASE_URL.get(url)
        return res.data
    },

    getNewProducts: async ({ page = 1, limit = 10, sortBy = "productName", orderBy = "asc" }) => {
        let url = `/products/new-products?page=${page - 1}&limit=${limit}`
        if (sortBy && orderBy) {
            url += `&sortBy=${sortBy}&orderBy=${orderBy}`
        }
        const res = await BASE_URL.get(url)
        return res.data
    },

    getBestSellerProducts: async ({ page = 1, limit = 10, sortBy = "productName", orderBy = "asc" }) => {
        let url = `/products/best-seller-products?page=${page - 1}&limit=${limit}`
        if (sortBy && orderBy) {
            url += `&sortBy=${sortBy}&orderBy=${orderBy}`
        }
        const res = await BASE_URL.get(url)
        return res.data
    }
}

export default productService