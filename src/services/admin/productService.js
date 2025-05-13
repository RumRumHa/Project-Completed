import { adminFormDataApi } from '../../services/baseApiService';

const productService = {
  // Lấy danh sách sản phẩm với phân trang và sắp xếp
  getProductAPI: async (params = {}) => {
    const defaultParams = {
      page: 1,
      limit: 10,
      sortBy: "productName",
      orderBy: "asc"
    };
    return adminFormDataApi.get('/products', { ...defaultParams, ...params });
  },
  
  // Tìm kiếm sản phẩm
  searchProductAPI: async (params = {}) => {
    const defaultParams = {
      page: 1,
      limit: 10,
      keyword: "",
      sortBy: "productName",
      orderBy: "asc"
    };
    return adminFormDataApi.get('/products/search', { ...defaultParams, ...params });
  },
  
  // Lấy sản phẩm theo ID
  getProductByIdAPI: async (id) => {
    return adminFormDataApi.getById('/products', id);
  },
  
  // Tạo sản phẩm mới
  createProduct: async (formData) => {
    return adminFormDataApi.post("/products", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  // Cập nhật sản phẩm
  updateProduct: async (id, formData) => {
    return adminFormDataApi.put(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json'
      }
    });
  },
  
  // Xóa sản phẩm
  deleteProduct: async (id) => {
    return adminFormDataApi.delete(`/products/${id}`);
  },
};

export default productService;
