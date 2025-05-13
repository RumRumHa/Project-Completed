import { userApi } from '../baseApiService';
import Cookies from 'js-cookie';

/**
 * Cache cho giỏ hàng
 * @type {Object}
 */
const cartCache = {
  data: null,
  timestamp: null,
  maxAge: 2 * 60 * 1000 // 2 phút
};

/**
 * Lấy cấu hình xác thực cho API
 * @returns {Object} Cấu hình header với token
 */
const getAuthConfig = () => {
  const token = Cookies.get('token');
  if (!token) {
    throw new Error('Bạn chưa đăng nhập!');
  }
  return {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
};

/**
 * Gọi API với cơ chế retry
 * @param {Function} apiCall - Hàm gọi API
 * @param {number} maxRetries - Số lần thử lại tối đa
 * @returns {Promise<any>} Kết quả từ API
 */
const callWithRetry = async (apiCall, maxRetries = 2) => {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      // Chỉ retry nếu lỗi server (5xx)
      if (error.response?.status >= 500) {
        // Chờ thêm thời gian trước khi thử lại
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
};

export const cartService = {
  /**
   * Lấy thông tin giỏ hàng
   * @param {boolean} forceRefresh - Buộc làm mới cache
   * @returns {Promise<Object>} Thông tin giỏ hàng
   */
  getCart: async (forceRefresh = false) => {
    // Sử dụng cache nếu có và chưa hết hạn
    if (!forceRefresh && cartCache.data && 
        (Date.now() - cartCache.timestamp < cartCache.maxAge)) {
      return cartCache.data;
    }

    try {
      const result = await callWithRetry(() => 
        userApi.get('/cart/list', {}, getAuthConfig())
      );
      
      // Cập nhật cache
      cartCache.data = result;
      cartCache.timestamp = Date.now();
      
      return result;
    } catch (error) {
      console.error('Lỗi khi lấy giỏ hàng:', error);
      throw error;
    }
  },

  /**
   * Thêm sản phẩm vào giỏ hàng
   * @param {string} productId - ID sản phẩm
   * @param {number} quantity - Số lượng
   * @returns {Promise<Object>} Kết quả thêm vào giỏ hàng
   */
  addToCart: async (productId, quantity = 1) => {
    try {
      const result = await callWithRetry(() => 
        userApi.post('/cart/add', null, {
          ...getAuthConfig(),
          params: { productId, quantity }
        })
      );
      
      // Xóa cache để bắt buộc lấy dữ liệu mới
      cartCache.data = null;
      
      return result;
    } catch (error) {
      if (error.response?.status === 400) {
        throw new Error('Không thể thêm sản phẩm vào giỏ hàng. Vui lòng kiểm tra số lượng!');
      }
      console.error('Lỗi khi thêm vào giỏ hàng:', error);
      throw error;
    }
  },

  /**
   * Cập nhật số lượng sản phẩm trong giỏ hàng
   * @param {string} cartItemId - ID mục giỏ hàng
   * @param {number} quantity - Số lượng mới
   * @returns {Promise<Object>} Kết quả cập nhật
   */
  updateCartItem: async (cartItemId, quantity) => {
    try {
      if (quantity <= 0) {
        throw new Error('Số lượng phải lớn hơn 0');
      }
      
      const result = await callWithRetry(() => 
        userApi.put(`/cart/items/${cartItemId}`, { quantity }, getAuthConfig())
      );
      
      // Xóa cache để bắt buộc lấy dữ liệu mới
      cartCache.data = null;
      
      return result;
    } catch (error) {
      console.error('Lỗi khi cập nhật giỏ hàng:', error);
      throw error;
    }
  },

  /**
   * Xóa sản phẩm khỏi giỏ hàng
   * @param {string} cartItemId - ID mục giỏ hàng
   * @returns {Promise<Object>} Kết quả xóa
   */
  removeFromCart: async (cartItemId) => {
    try {
      const result = await callWithRetry(() => 
        userApi.delete(`/cart/items/${cartItemId}`, getAuthConfig())
      );
      
      // Xóa cache để bắt buộc lấy dữ liệu mới
      cartCache.data = null;
      
      return result;
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', error);
      throw error;
    }
  },

  /**
   * Xóa toàn bộ giỏ hàng
   * @returns {Promise<Object>} Kết quả xóa
   */
  clearCart: async () => {
    try {
      const result = await callWithRetry(() => 
        userApi.delete('/cart/clear', getAuthConfig())
      );
      
      // Xóa cache để bắt buộc lấy dữ liệu mới
      cartCache.data = null;
      
      return result;
    } catch (error) {
      console.error('Lỗi khi xóa toàn bộ giỏ hàng:', error);
      throw error;
    }
  },

  /**
   * Thanh toán giỏ hàng
   * @param {Object} shippingInfo - Thông tin giao hàng (tùy chọn)
   * @returns {Promise<Object>} Kết quả thanh toán
   */
  checkout: async (shippingInfo = null) => {
    try {
      const result = await callWithRetry(() => 
        userApi.post('/cart/checkout', shippingInfo, getAuthConfig())
      );
      
      // Xóa cache để bắt buộc lấy dữ liệu mới
      cartCache.data = null;
      
      return result;
    } catch (error) {
      if (error.response?.status === 400) {
        throw new Error('Không thể thanh toán. Vui lòng kiểm tra giỏ hàng!');
      }
      console.error('Lỗi khi thanh toán:', error);
      throw error;
    }
  },
  
  /**
   * Kiểm tra sản phẩm có trong giỏ hàng hay không
   * @param {string} productId - ID sản phẩm cần kiểm tra
   * @returns {Promise<boolean>} True nếu sản phẩm đã có trong giỏ hàng
   */
  isProductInCart: async (productId) => {
    try {
      const cart = await cartService.getCart();
      return cart.items.some(item => item.product.id === productId);
    } catch (error) {
      console.error('Lỗi khi kiểm tra sản phẩm trong giỏ hàng:', error);
      return false;
    }
  },
  
  /**
   * Lấy số lượng sản phẩm trong giỏ hàng
   * @returns {Promise<number>} Số lượng sản phẩm
   */
  getCartItemCount: async () => {
    try {
      const cart = await cartService.getCart();
      return cart.items.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
      console.error('Lỗi khi lấy số lượng sản phẩm trong giỏ hàng:', error);
      return 0;
    }
  }
};