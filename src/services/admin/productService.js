import { BASE_URL_ADMIN_FORMDATA } from '../../api'

const productService = {
  getProductAPI: async ({ page = 1, limit = 10, sortBy = "productName", orderBy = "asc" }) => {
    let url = `/products?page=${page - 1}&limit=${limit}`
    if (sortBy && orderBy) {
      url += `&sortBy=${sortBy}&orderBy=${orderBy}`
    }
    const res = await BASE_URL_ADMIN_FORMDATA.get(url);
    return res.data;
  },
  
  searchProductAPI: async ({ page = 1, limit = 10, keyword = "", sortBy = "productName", orderBy = "asc" }) => {
    let url = `/products/search?keyword=${keyword}&page=${page - 1}&limit=${limit}`
    if (sortBy && orderBy) {
      url += `&sortBy=${sortBy}&orderBy=${orderBy}`
    }
    const res = await BASE_URL_ADMIN_FORMDATA.get(url);
    return res.data;
  },
  
  getProductByIdAPI: async (id) => {
    const res = await BASE_URL_ADMIN_FORMDATA.get(`/products/${id}`);
    return res.data;
  },
  
  createProduct: async (formData) => {
    const response = await BASE_URL_ADMIN_FORMDATA.post("/products", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  
  updateProduct: async (id, formData) => {
    const response = await BASE_URL_ADMIN_FORMDATA.put(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json'
      }
    });
    return response.data;
  },
  
  deleteProduct: async (id) => {
    const response = await BASE_URL_ADMIN_FORMDATA.delete(`/products/${id}`);
    return response.data;
  },
}

export default productService;
