import { BASE_URL_ADMIN, BASE_URL_ADMIN_FORMDATA } from '../../api'

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

  createCategory: async (formData) => {
    const res = await BASE_URL_ADMIN_FORMDATA.post('/categories', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json'
      }
    })
    return res.data
  },

  updateCategory: async (id, formData) => {
    const res = await BASE_URL_ADMIN_FORMDATA.put(`/categories/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json'
      }
    });
    return res.data
  },

  deleteCategory: async (id) => {
    const res = await BASE_URL_ADMIN.delete(`/categories/${id}`)
    return res.data
  },
}

export default categoryService;
