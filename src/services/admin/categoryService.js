import { BASE_URL_ADMIN } from '../../api'

const categoryService = {
  getCategoryAPI: async ({ page = 1, limit = 10, sortBy = "categoryName", orderBy = "asc" }) => {
    let url = `/categories?page=${page - 1}&limit=${limit}`
    if (sortBy && orderBy) {
      url += `&sortBy=${sortBy}&orderBy=${orderBy}`
    }
    const res = await BASE_URL_ADMIN.get(url)
    return res.data
  },
  
  searchCategoryAPI: async ({ page = 1, limit = 10, keyword = "", sortBy = "categoryName", orderBy = "asc" }) => {
    let url = `/categories/search?keyword=${keyword}&page=${page - 1}&limit=${limit}`
    if (sortBy && orderBy) {
      url += `&sortBy=${sortBy}&orderBy=${orderBy}`
    }
    const res = await BASE_URL_ADMIN.get(url)
    return res.data
  },
  
  getCategoryByIdAPI: async (id) => {
    const res = await BASE_URL_ADMIN.get(`/categories/${id}`)
    return res.data
  },
  
  createCategory: async (data) => {
    const res = await BASE_URL_ADMIN.post('/categories', data)
    return res.data
  },
  
  updateCategory: async (id, data) => {
    const res = await BASE_URL_ADMIN.put(`/categories/${id}`, data)
    return res.data
  },
  
  deleteCategory: async (id) => {
    const res = await BASE_URL_ADMIN.delete(`/categories/${id}`)
    return res.data
  },
}

export default categoryService;
