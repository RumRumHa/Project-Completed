import { adminApi, adminFormDataApi } from '../../services/baseApiService';

const categoryService = {
  // Lấy danh sách danh mục với phân trang và sắp xếp
  getCategoryAPI: async (params = {}) => {
    const defaultParams = {
      page: 1,
      limit: 10,
      sortBy: "categoryName",
      orderBy: "asc"
    };
    return adminApi.get('/categories', { ...defaultParams, ...params });
  },

  // Tìm kiếm danh mục
  searchCategoryAPI: async (params = {}) => {
    const defaultParams = {
      page: 1,
      limit: 10,
      keyword: "",
      sortBy: "categoryName",
      orderBy: "asc"
    };
    return adminApi.get('/categories/search', { ...defaultParams, ...params });
  },

  // Lấy danh mục theo ID
  getCategoryByIdAPI: async (id) => {
    return adminApi.getById('/categories', id);
  },

  // Tạo danh mục mới
  createCategory: async (formData) => {
    return adminFormDataApi.post('/categories', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json'
      }
    });
  },

  // Cập nhật danh mục
  updateCategory: async (id, formData) => {
    return adminFormDataApi.put(`/categories/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json'
      }
    });
  },

  // Xóa danh mục
  deleteCategory: async (id) => {
    return adminApi.delete(`/categories/${id}`);
  },
};

export default categoryService;
