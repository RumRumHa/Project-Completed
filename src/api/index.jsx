import axios from "axios";
import Cookies from "js-cookie";

export const BASE_URL = axios.create({
    baseURL: "http://localhost:8080/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
});

export const BASE_URL_ADMIN = axios.create({
    baseURL: "http://localhost:8080/api/v1/admin",
    headers: {
        "Content-Type": "application/json",
    },
});

export const BASE_URL_ADMIN_FORMDATA = axios.create({
    baseURL: "http://localhost:8080/api/v1/admin",
    headers: {
        "Content-Type": "multipart/form-data",
    },
});

export const BASE_URL_USER = axios.create({
    baseURL: "http://localhost:8080/api/v1/user",
    headers: {
        "Content-Type": "application/json",
    },
});

export const BASE_URL_AUTH = axios.create({
    baseURL: "http://localhost:8080/api/v1/auth",
    headers: {
        "Content-Type": "application/json",
    },
});

export const BASE_URL_AUTH_FORMDATA = axios.create({
    baseURL: "http://localhost:8080/api/v1/auth",
    headers: {
        "Content-Type": "multipart/form-data",
    },
});

const addAuthToken = (instance) => {
    instance.interceptors.request.use((config) => {
        const token = Cookies.get("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    })
}

addAuthToken(BASE_URL_ADMIN);
addAuthToken(BASE_URL_ADMIN_FORMDATA);