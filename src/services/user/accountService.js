    import { userApi } from '../../services/baseApiService';
import Cookies from 'js-cookie';

/**
 * Helper để lấy cấu hình xác thực từ token
 * @param {string} token - Token xác thực, nếu không cung cấp sẽ lấy từ cookie
 * @returns {Object} Cấu hình headers với token xác thực
 */
const getAuthConfig = (token) => {
    // Nếu không cung cấp token, lấy từ cookie
    const authToken = token || Cookies.get('token');
    return {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    };
};

/**
 * Dịch vụ quản lý tài khoản người dùng
 */
const accountService = {
    /**
     * Lấy thông tin tài khoản
     * @param {string} token - Token xác thực
     * @returns {Promise<any>} Thông tin tài khoản
     */
    getAccountInfo: async (token) => {
        return userApi.get('/account', {}, getAuthConfig(token));
    },

    /**
     * Cập nhật thông tin tài khoản
     * @param {FormData} formData - Dữ liệu form cập nhật
     * @param {string} token - Token xác thực
     * @returns {Promise<any>} Kết quả cập nhật
     */
    updateAccountInfo: async (formData, token) => {
        return userApi.put('/account', formData, {
            ...getAuthConfig(token),
            headers: {
                ...getAuthConfig(token).headers,
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    /**
     * Đổi mật khẩu
     * @param {Object} passwordData - Dữ liệu mật khẩu
     * @param {string} token - Token xác thực
     * @returns {Promise<any>} Kết quả đổi mật khẩu
     */
    changePassword: async (passwordData, token) => {
        return userApi.put('/account/change-password', passwordData, getAuthConfig(token));
    },

    /**
     * Lấy danh sách địa chỉ
     * @param {string} token - Token xác thực
     * @returns {Promise<any>} Danh sách địa chỉ
     */
    getAddresses: async (token) => {
        return userApi.get('/account/addresses', {}, getAuthConfig(token));
    },

    /**
     * Thêm địa chỉ mới
     * @param {Object} addressData - Dữ liệu địa chỉ
     * @param {string} token - Token xác thực
     * @returns {Promise<any>} Kết quả thêm địa chỉ
     */
    addAddress: async (addressData, token) => {
        return userApi.post('/account/addresses', addressData, getAuthConfig(token));
    },

    /**
     * Cập nhật địa chỉ
     * @param {Object} addressData - Dữ liệu địa chỉ
     * @param {string} token - Token xác thực
     * @returns {Promise<any>} Kết quả cập nhật địa chỉ
     */
    updateAddress: async (addressData, token) => {
        return userApi.put(`/account/addresses/${addressData.addressId}`, addressData, getAuthConfig(token));
    },

    /**
     * Đặt địa chỉ mặc định
     * @param {string|number} addressId - ID của địa chỉ
     * @param {string} token - Token xác thực
     * @returns {Promise<any>} Kết quả đặt địa chỉ mặc định
     */
    setDefaultAddress: async (addressId, token) => {
        return userApi.put(`/addresses/${addressId}/default`, null, getAuthConfig(token));
    },

    /**
     * Lấy địa chỉ theo ID
     * @param {string|number} addressId - ID của địa chỉ
     * @param {string} token - Token xác thực
     * @returns {Promise<any>} Thông tin địa chỉ
     */
    getAddressById: async (addressId, token) => {
        return userApi.get(`/account/addresses/${addressId}`, {}, getAuthConfig(token));
    },

    /**
     * Xóa địa chỉ
     * @param {string|number} addressId - ID của địa chỉ
     * @param {string} token - Token xác thực
     * @returns {Promise<any>} Kết quả xóa địa chỉ
     */
    deleteAddress: async (addressId, token) => {
        return userApi.delete(`/account/addresses/${addressId}`, getAuthConfig(token));
    },

    /**
     * Lấy danh sách yêu thích
     * @param {string} token - Token xác thực
     * @returns {Promise<any>} Danh sách yêu thích
     */
    getWishlist: async (token) => {
        return userApi.get('/wish-list', {}, getAuthConfig(token));
    },

    /**
     * Thêm sản phẩm vào danh sách yêu thích
     * @param {string|number} productId - ID của sản phẩm
     * @param {string} token - Token xác thực
     * @returns {Promise<any>} Kết quả thêm vào danh sách yêu thích
     */
    addToWishlist: async (productId, token) => {
        return userApi.post('/wish-list', null, {
            ...getAuthConfig(token),
            params: { productId }
        });
    },

    /**
     * Xóa sản phẩm khỏi danh sách yêu thích
     * @param {string|number} wishListId - ID của mục yêu thích
     * @param {string} token - Token xác thực
     * @returns {Promise<any>} Kết quả xóa khỏi danh sách yêu thích
     */
    removeFromWishlist: async (wishListId, token) => {
        return userApi.delete(`/wish-list/${wishListId}`, getAuthConfig(token));
    },

    /**
     * Lấy lịch sử đơn hàng
     * @param {string} token - Token xác thực
     * @returns {Promise<any>} Lịch sử đơn hàng
     */
    getOrderHistory: async (token) => {
        return userApi.get('/history', {}, getAuthConfig(token));
    },

    /**
     * Lấy chi tiết đơn hàng theo số serial
     * @param {string} serialNumber - Số serial của đơn hàng
     * @param {string} token - Token xác thực
     * @returns {Promise<any>} Chi tiết đơn hàng
     */
    getOrderDetail: async (serialNumber, token) => {
        return userApi.get(`/history/${serialNumber}`, {}, getAuthConfig(token));
    },

    /**
     * Lấy danh sách đơn hàng theo trạng thái
     * @param {string} status - Trạng thái đơn hàng
     * @param {string} token - Token xác thực
     * @returns {Promise<any>} Danh sách đơn hàng theo trạng thái
     */
    getOrdersByStatus: async (status, token) => {
        return userApi.get(`/history/status/${status}`, {}, getAuthConfig(token));
    },

    /**
     * Hủy đơn hàng
     * @param {string|number} orderId - ID của đơn hàng
     * @param {string} token - Token xác thực
     * @returns {Promise<any>} Kết quả hủy đơn hàng
     */
    cancelOrder: async (orderId, token) => {
        return userApi.put(`/history/${orderId}/cancel`, null, getAuthConfig(token));
    }
};

export default accountService;