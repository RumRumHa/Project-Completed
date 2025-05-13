import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export const BASE_URL = axios.create({
    baseURL: "http://localhost:8080/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000, // 10 giây timeout mặc định
});

export const BASE_URL_ADMIN = axios.create({
    baseURL: "http://localhost:8080/api/v1/admin",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000, // 10 giây timeout mặc định
});

export const BASE_URL_ADMIN_FORMDATA = axios.create({
    baseURL: "http://localhost:8080/api/v1/admin",
    headers: {
        "Content-Type": "multipart/form-data",
    },
    timeout: 30000, // 30 giây timeout cho upload file
});

export const BASE_URL_USER = axios.create({
    baseURL: "http://localhost:8080/api/v1/user",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000, // 10 giây timeout mặc định
});

export const BASE_URL_AUTH = axios.create({
    baseURL: "http://localhost:8080/api/v1/auth",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000, // 10 giây timeout mặc định
});

export const BASE_URL_AUTH_FORMDATA = axios.create({
    baseURL: "http://localhost:8080/api/v1/auth",
    headers: {
        "Content-Type": "multipart/form-data",
    },
    timeout: 30000, // 30 giây timeout cho upload file
});

/**
 * Thêm token xác thực vào header của request
 * @param {Object} instance - Instance axios
 */
const addAuthToken = (instance) => {
    instance.interceptors.request.use(
        (config) => {
            const token = Cookies.get("token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
}

/**
 * Thêm interceptor xử lý lỗi chung cho các API instances
 * @param {Object} instance - Instance axios
 */
const addErrorHandler = (instance) => {
    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            // Xử lý lỗi timeout
            if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
                console.error('Request timeout:', error);
                // Không hiển thị toast ở đây, để service xử lý
            }
            
            // Xử lý lỗi mạng
            if (!error.response) {
                console.error('Network error:', error);
                // Không hiển thị toast ở đây, để service xử lý
            }
            
            // Xử lý lỗi 401 - Unauthorized
            if (error.response && error.response.status === 401) {
                // Nếu token hết hạn, xóa token và chuyển về trang đăng nhập
                if (Cookies.get('token')) {
                    Cookies.remove('token');
                    Cookies.remove('refreshToken');
                    // Chỉ hiển thị thông báo nếu không phải ở trang đăng nhập
                    if (!window.location.pathname.includes('/login')) {
                        toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
                        setTimeout(() => {
                            window.location.href = '/login';
                        }, 1500);
                    }
                }
            }
            
            return Promise.reject(error);
        }
    );
}

// Thêm token xác thực cho các API instances cần xác thực
addAuthToken(BASE_URL_ADMIN);
addAuthToken(BASE_URL_ADMIN_FORMDATA);
addAuthToken(BASE_URL_USER);

// Thêm xử lý lỗi cho tất cả các API instances
addErrorHandler(BASE_URL);
addErrorHandler(BASE_URL_ADMIN);
addErrorHandler(BASE_URL_ADMIN_FORMDATA);
addErrorHandler(BASE_URL_USER);
addErrorHandler(BASE_URL_AUTH);
addErrorHandler(BASE_URL_AUTH_FORMDATA);