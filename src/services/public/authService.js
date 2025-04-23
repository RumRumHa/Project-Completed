import { BASE_URL_AUTH, BASE_URL_AUTH_FORMDATA, BASE_URL_USER } from '../../api'
import Cookies from 'js-cookie'

const authService = {
    login: async (credentials) => {
        try {
            const loginRes = await BASE_URL_AUTH.post('/sign-in', credentials)
            const { token } = loginRes.data

            if (!token) {
                throw new Error('Không nhận được token từ server')
            }

            const userRes = await BASE_URL_USER.get('/account', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (userRes.data.isDeleted) {
                throw new Error('Tài khoản không tồn tại!')
            }
            if (!userRes.data.status) {
                throw new Error('Tài khoản đã bị khóa!')
            }

            const roles = userRes.data.roleName || []
            const user = {
                username: credentials.username,
                avatar: userRes.data.avatar || '',
                fullname: userRes.data.fullname || '',
                ...userRes.data
            }

            Cookies.set('token', token, { expires: 7 })
            Cookies.set('role', JSON.stringify(roles), { expires: 7 })
            Cookies.set('user', JSON.stringify(user), { expires: 7 })

            return {
                token,
                user,
                roles
            }
        } catch (error) {
            if (typeof error === 'object' && error !== null && error.response?.status === 404) {
                throw new Error('Tài khoản không tồn tại!');
            } else if (typeof error === 'object' && error !== null && error.response?.status === 403) {
                throw new Error('Tài khoản đã bị khóa!');
            } else if (typeof error === 'object' && error !== null && error.response?.data?.message) {
                throw new Error(error.response.data.message);
            } else if (typeof error === 'string') {
                throw new Error(error);
            } else if (error instanceof Error) {
                throw error;
            } else {
                throw new Error('Tên đăng nhập hoặc mật khẩu không đúng!');
            }
        }
    },

    register: async (userData) => {
        try {
            const formData = new FormData();
            formData.append('username', userData.username);
            formData.append('email', userData.email);
            formData.append('password', userData.password);
            formData.append('fullname', userData.fullName);
            formData.append('phone', userData.phone);
            formData.append('address', userData.address || '');

            // Avatar is required
            if (!userData.avatar) {
                throw new Error('Vui lòng chọn ảnh đại diện!');
            }

            // Handle File object
            const avatarFile = userData.avatar instanceof File ? userData.avatar : userData.avatar.originFileObj;
            if (!avatarFile) {
                throw new Error('File ảnh không hợp lệ!');
            }
            formData.append('avatar', avatarFile);

            const response = await BASE_URL_AUTH_FORMDATA.post('/sign-up', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201) {
                return response.data;
            } else {
                throw new Error(response.data.message || 'Đăng ký thất bại!');
            }
        } catch (error) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            } else {
                throw new Error('Đăng ký thất bại! Vui lòng thử lại.');
            }
        }
    },

    logout: () => {
        Cookies.remove('token')
        Cookies.remove('role')
        Cookies.remove('user')
    },

    getCurrentUser: () => {
        const user = Cookies.get('user')
        return user ? JSON.parse(user) : null
    },

    getToken: () => {
        return Cookies.get('token') || null
    },

    getRoles: () => {
        try {
            const roles = Cookies.get('role')
            return roles ? JSON.parse(roles) : []
        } catch {
            return []
        }
    },

    changePassword: async (passwordData) => {
        try {
            const token = Cookies.get('token');
            if (!token) {
                throw new Error('Bạn chưa đăng nhập!');
            }

            const response = await BASE_URL_USER.put('/account/change-password',
                {
                    oldPass: passwordData.oldPass,
                    newPass: passwordData.newPass,
                    confirmNewPass: passwordData.newPass
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                return response.data;
            }

            throw new Error(response.data.message || 'Đổi mật khẩu thất bại!');
        } catch (error) {
            if (error.response?.status === 400) {
                const message = error.response.data.message;
                if (message.includes('do not match')) {
                    throw new Error('Mật khẩu mới và xác nhận mật khẩu không khớp!');
                } else if (message.includes('incorrect')) {
                    throw new Error('Mật khẩu hiện tại không chính xác!');
                }
                throw new Error(message);
            } else if (error.response?.status === 401) {
                throw new Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!');
            } else if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            } else {
                throw new Error('Đổi mật khẩu thất bại! Vui lòng thử lại.');
            }
        }
    }
}

export default authService
