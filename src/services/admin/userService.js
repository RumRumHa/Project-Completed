import { BASE_URL_ADMIN, BASE_URL_ADMIN_FORMDATA } from "../../api/index";

const getUserAPI = async ({ page = 1, limit = 10, sortBy = "username", orderBy = "asc" }) => {
    let url = `/users?page=${page - 1}&limit=${limit}`;
    if (sortBy && orderBy) {
        url += `&sortBy=${sortBy}&orderBy=${orderBy}`;
    }
    const res = await BASE_URL_ADMIN_FORMDATA.get(url);
    return res.data;
};

const searchUserAPI = async ({ page = 1, limit = 10, keyword = '', sortBy = "username", orderBy = "asc" }) => {
    let url = `/users/search?keyword=${keyword}&page=${page - 1}&limit=${limit}`;
    if (sortBy && orderBy) {
        url += `&sortBy=${sortBy}&orderBy=${orderBy}`;
    }
    const res = await BASE_URL_ADMIN_FORMDATA.get(url);
    return res.data;
};

const getUserByIdAPI = async (id) => {
    const res = await BASE_URL_ADMIN_FORMDATA.get(`/users/${id}`);
    return res.data;
};

const createUser = async (formData) => {
    const response = await BASE_URL_ADMIN_FORMDATA.post("/users", formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

const updateUser = async (id, formData) => {
    const response = await BASE_URL_ADMIN_FORMDATA.put(`/users/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json'
        }
    });
    return response.data;
};

const deleteUser = async (id) => {
    const response = await BASE_URL_ADMIN_FORMDATA.delete(`/users/${id}`);
    return response.data;
};

const updateUserStatus = async (userId) => {
    const response = await BASE_URL_ADMIN.put(`/users/status/${userId}`);
    return response.data;
};

const addRoleToUser = async (userId, roleId) => {
    const response = await BASE_URL_ADMIN.post(`/users/${userId}/role/${roleId}`);
    return response.data;
};

const removeRoleFromUser = async (userId, roleId) => {
    const response = await BASE_URL_ADMIN.delete(`/users/${userId}/role/${roleId}`);
    return response.data;
};

export const userService = {
    getUserAPI,
    getUserByIdAPI,
    createUser,
    updateUser,
    deleteUser,
    searchUserAPI,
    updateUserStatus,
    addRoleToUser,
    removeRoleFromUser
};