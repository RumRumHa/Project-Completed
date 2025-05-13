import { adminApi } from "../../services/baseApiService";

/**
 * Dịch vụ quản lý vai trò cho trang quản trị
 */
export const roleService = {
    /**
     * Lấy danh sách tất cả vai trò
     * @returns {Promise<any>} Danh sách vai trò
     */
    getRolesAPI: async () => {
        return adminApi.get("/roles");
    },

    /**
     * Thêm vai trò cho người dùng
     * @param {string|number} userId - ID của người dùng
     * @param {string|number} roleId - ID của vai trò
     * @returns {Promise<any>} Kết quả thêm vai trò
     */
    addRoleToUserAPI: async (userId, roleId) => {
        return adminApi.post(`/users/${userId}/role/${roleId}`);
    },

    /**
     * Xóa vai trò của người dùng
     * @param {string|number} userId - ID của người dùng
     * @param {string|number} roleId - ID của vai trò
     * @returns {Promise<any>} Kết quả xóa vai trò
     */
    removeRoleFromUserAPI: async (userId, roleId) => {
        return adminApi.delete(`/users/${userId}/role/${roleId}`);
    }
};
