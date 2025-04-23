import { BASE_URL_ADMIN } from '../../api'

const orderService = {
  getOrdersAPI: async ({ page = 1, limit = 10, sortBy = "createdAt", orderBy = "desc", status }) => {
    let url = `/orders?page=${page - 1}&limit=${limit}`
    if (sortBy && orderBy) {
      url += `&sortBy=${sortBy}&orderBy=${orderBy}`
    }
    if (status && status !== 'all') {
      url += `&status=${status}`
    }
    const res = await BASE_URL_ADMIN.get(url)
    return res.data
  },

  getOrderByIdAPI: async (id) => {
    try {
      const res = await BASE_URL_ADMIN.get(`/orders/orderDetail/${id}`)
      return res.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  getOrderByStatusAPI: async ({ page = 1, limit = 10, sortBy = "createdAt", orderBy = "desc", status }) => {
    let url = `/orders/${status}?page=${page - 1}&limit=${limit}`
    if (sortBy && orderBy) {
      url += `&sortBy=${sortBy}&orderBy=${orderBy}`
    }
    const res = await BASE_URL_ADMIN.get(url)
    return res.data
  },

  updateOrderStatusAPI: async (id, status) => {
    const res = await BASE_URL_ADMIN.put(`/orders/${id}/status/${status}`)
    return res.data
  },

  deleteOrderAPI: async (id) => {
    const res = await BASE_URL_ADMIN.delete(`/orders/${id}`)
    return res.data
  },
}

export default orderService;
