    import { BASE_URL_USER } from '../../api';

const accountService = {
    // Lấy thông tin tài khoản
    getAccountInfo: async (token) => {
        const response = await BASE_URL_USER.get('/account', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },
    // Cập nhật thông tin tài khoản
    updateAccountInfo: async (formData, token) => {
        const response = await BASE_URL_USER.put('/account', formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },
    // Đổi mật khẩu
    changePassword: async (passwordData, token) => {
        const response = await BASE_URL_USER.put('/account/change-password', passwordData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },
    getAddresses: async (token) => {
        const response = await BASE_URL_USER.get('/account/addresses', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },
    addAddress: async (addressData, token) => {
        const response = await BASE_URL_USER.post('/account/addresses', addressData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },
    updateAddress: async (addressData, token) => {
        const response = await BASE_URL_USER.put(`/account/addresses/${addressData.addressId}`, addressData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },
    setDefaultAddress: async (addressId, token) => {
        const response = await BASE_URL_USER.put(`/addresses/${addressId}/default`, null, {
            headers: { Authorization: `Bearer ${token}` }
        })
        return response.data
    },
    getAddressById: async (addressId, token) => {
        const response = await BASE_URL_USER.get(`/account/addresses/${addressId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },
    deleteAddress: async (addressId, token) => {
        await BASE_URL_USER.delete(`/account/addresses/${addressId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },
    // Lấy danh sách yêu thích
    getWishlist: async (token) => {
        const response = await BASE_URL_USER.get('/wish-list', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },
    // Thêm sản phẩm vào danh sách yêu thích
    addToWishlist: async (productId, token) => {
        const response = await BASE_URL_USER.post('/wish-list', null, {
            headers: { Authorization: `Bearer ${token}` },
            params: { productId }
        });
        return response.data;
    },
    // Xóa sản phẩm khỏi danh sách yêu thích
    removeFromWishlist: async (wishListId, token) => {
        await BASE_URL_USER.delete(`/wish-list/${wishListId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },
    // Lấy lịch sử đơn hàng
    getOrderHistory: async (token) => {
        const response = await BASE_URL_USER.get('/history', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },
    // Lấy chi tiết đơn hàng theo số serial
    getOrderDetail: async (serialNumber, token) => {
        const response = await BASE_URL_USER.get(`/history/${serialNumber}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },
    // Lấy danh sách đơn hàng theo trạng thái
    getOrdersByStatus: async (status, token) => {
        const response = await BASE_URL_USER.get(`/history/status/${status}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },
    // Hủy đơn hàng
    cancelOrder: async (orderId, token) => {
        await BASE_URL_USER.put(`/history/${orderId}/cancel`, null, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
};

export default accountService; 