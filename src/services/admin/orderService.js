import { adminApi } from '../../services/baseApiService';

const orderService = {
  // Lấy danh sách đơn hàng với phân trang và sắp xếp
  getOrdersAPI: async (params = {}) => {
    const defaultParams = {
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      orderBy: "desc"
    };
    
    // Tạo tham số mới với các giá trị mặc định và tham số được truyền vào
    const mergedParams = { ...defaultParams, ...params };
    
    // Loại bỏ trạng thái 'all' khỏi tham số truy vấn
    if (mergedParams.status === 'all') {
      delete mergedParams.status;
    }
    
    return adminApi.get('/orders', mergedParams);
  },

  // Lấy đơn hàng theo ID
  getOrderByIdAPI: async (id) => {
    return adminApi.get(`/orders/orderDetail/${id}`);
  },

  // Lấy đơn hàng theo trạng thái
  getOrderByStatusAPI: async (params = {}) => {
    const { status, ...otherParams } = params;
    
    if (!status) {
      throw new Error('Cần cung cấp trạng thái đơn hàng');
    }
    
    const defaultParams = {
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      orderBy: "desc"
    };
    
    return adminApi.get(`/orders/${status}`, { ...defaultParams, ...otherParams });
  },

  // Cập nhật trạng thái đơn hàng
  updateOrderStatusAPI: async (id, status) => {
    return adminApi.put(`/orders/${id}/status/${status}`);
  },

  // Xóa đơn hàng
  deleteOrderAPI: async (id) => {
    return adminApi.delete(`/orders/${id}`);
  },
};

export default orderService;
