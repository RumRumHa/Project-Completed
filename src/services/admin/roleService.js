import { BASE_URL_ADMIN } from "../../api/index";

const getRolesAPI = async () => {
    const response = await BASE_URL_ADMIN.get("/roles");
    return response.data;
};

const addRoleToUserAPI = async (userId, roleId) => {
    const response = await BASE_URL_ADMIN.post(`/users/${userId}/role/${roleId}`);
    return response.data;
};

const removeRoleFromUserAPI = async (userId, roleId) => {
    const response = await BASE_URL_ADMIN.delete(`/users/${userId}/role/${roleId}`);
    return response.data;
};

export const roleService = {
    getRolesAPI,
    addRoleToUserAPI,
    removeRoleFromUserAPI
};
