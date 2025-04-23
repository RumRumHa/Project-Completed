import { BASE_URL } from '../../api'

const categoryService = {
    getCategories: async ({ page = 0, limit = 10, sortBy = 'categoryName', orderBy = 'asc' }) => {
        try {
            const res = await BASE_URL.get(`/categories?page=${page}&limit=${limit}&sortBy=${sortBy}&orderBy=${orderBy}`)
            return res.data
        } catch (error) {
            throw error.response?.data || error.message
        }
    },
    getCategoryById: async (id) => {
        const res = await BASE_URL.get(`/categories/${id}`)
        return res.data
    },
    getProductsByCategory: async (categoryId, { page = 1, limit = 10, sortBy = "productName", orderBy = "asc" }) => {
        let url = `/categories/${categoryId}/products?page=${page - 1}&limit=${limit}`
        if (sortBy && orderBy) {
            url += `&sortBy=${sortBy}&orderBy=${orderBy}`
        }
        const res = await BASE_URL.get(url)
        return res.data
    }
}

export default categoryService
