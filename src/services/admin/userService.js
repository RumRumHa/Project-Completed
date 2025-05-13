import { adminApi, adminFormDataApi } from "../../services/baseApiService";

// Sử dụng cách tiếp cận đối tượng thay vì các hàm riêng lẻ
const userService = {
    // Lấy danh sách người dùng với phân trang và sắp xếp
    getUserAPI: async (params = {}) => {
        const defaultParams = {
            page: 1,
            limit: 10,
            sortBy: "username",
            orderBy: "asc"
        };
        return adminFormDataApi.get('/users', { ...defaultParams, ...params });
    },

    // Tìm kiếm người dùng
    searchUserAPI: async (params = {}) => {
        const defaultParams = {
            page: 1,
            limit: 10,
            keyword: '',
            sortBy: "username",
            orderBy: "asc"
        };
        return adminFormDataApi.get('/users/search', { ...defaultParams, ...params });
    },

    // Lấy người dùng theo ID
    getUserByIdAPI: async (id) => {
        return adminFormDataApi.getById('/users', id);
    },

    // Tạo người dùng mới
    createUser: async (formData) => {
        return adminFormDataApi.post("/users", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    // Cập nhật người dùng
    updateUser: async (id, formData) => {
        return adminFormDataApi.put(`/users/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': 'application/json'
            }
        });
    },

    // Xóa người dùng
    deleteUser: async (id) => {
        return adminFormDataApi.delete(`/users/${id}`);
    },

    // Cập nhật trạng thái người dùng
    updateUserStatus: async (userId) => {
        return adminApi.put(`/users/status/${userId}`);
    },

    // Thêm vai trò cho người dùng
    addRoleToUser: async (userId, roleId) => {
        return adminApi.post(`/users/${userId}/role/${roleId}`);
    },

    // Xóa vai trò của người dùng
    removeRoleFromUser: async (userId, roleId) => {
        return adminApi.delete(`/users/${userId}/role/${roleId}`);
    }
};

export { userService };