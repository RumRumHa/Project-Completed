import { authApi, authFormDataApi, userApi } from '../../services/baseApiService';
import Cookies from 'js-cookie';

// Helper functions for cookie management
const cookieManager = {
    saveUserSession: (token, user, roles) => {
        Cookies.set('token', token, { expires: 7 });
        Cookies.set('role', JSON.stringify(roles), { expires: 7 });
        Cookies.set('user', JSON.stringify(user), { expires: 7 });
    },
    
    clearUserSession: () => {
        Cookies.remove('token');
        Cookies.remove('role');
        Cookies.remove('user');
    },
    
    getUser: () => {
        const user = Cookies.get('user');
        return user ? JSON.parse(user) : null;
    },
    
    getToken: () => Cookies.get('token') || null,
    
    getRoles: () => {
        try {
            const roles = Cookies.get('role');
            return roles ? JSON.parse(roles) : [];
        } catch {
            return [];
        }
    }
};

// Error handler for auth services
const handleAuthError = (error) => {
    if (typeof error === 'object' && error !== null) {
        // Kiểm tra lỗi đăng nhập sai mật khẩu
        if (error.response?.status === 401) {
            // Nếu đang đăng nhập, hiển thị thông báo sai thông tin đăng nhập
            if (error.config?.url?.includes('sign-in')) {
                throw new Error('Sai tên đăng nhập hoặc mật khẩu!');
            }
            // Nếu không phải đăng nhập, có thể là hết phiên làm việc
            throw new Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!');
        } else if (error.response?.status === 404) {
            throw new Error('Tài khoản không tồn tại!');
        } else if (error.response?.status === 403) {
            throw new Error('Tài khoản đã bị khóa!');
        } else if (error.response?.status === 400) {
            const message = error.response.data.message;
            if (message && typeof message === 'string') {
                if (message.includes('do not match')) {
                    throw new Error('Mật khẩu mới và xác nhận mật khẩu không khớp!');
                } else if (message.includes('incorrect')) {
                    throw new Error('Mật khẩu hiện tại không chính xác!');
                }
            }
            throw new Error(message || 'Yêu cầu không hợp lệ');
        } else if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
    } else if (typeof error === 'string') {
        throw new Error(error);
    } else if (error instanceof Error) {
        throw error;
    }
    
    throw new Error('Có lỗi xảy ra. Vui lòng thử lại!');
};

const authService = {
    // Đăng nhập
    login: async (credentials) => {
        try {
            // Gọi API đăng nhập để lấy token
            const loginResponse = await authApi.post('/sign-in', credentials);
            // API có thể trả về token trực tiếp hoặc nằm trong một đối tượng
            const token = typeof loginResponse === 'string' ? loginResponse : 
                        (loginResponse.token || 
                         (loginResponse.data && loginResponse.data.token));

            if (!token) {
                throw new Error('Không nhận được token từ server');
            }

            // Lấy thông tin người dùng bằng token
            const userData = await userApi.get('/account', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Kiểm tra trạng thái tài khoản
            if (userData.isDeleted) {
                throw new Error('Tài khoản không tồn tại!');
            }
            if (!userData.status) {
                throw new Error('Tài khoản đã bị khóa!');
            }

            // Chuẩn bị dữ liệu người dùng
            const roles = userData.roleName || [];
            const user = {
                username: credentials.username,
                avatar: userData.avatar || '',
                fullname: userData.fullname || '',
                ...userData
            };

            // Lưu thông tin phiên đăng nhập
            cookieManager.saveUserSession(token, user, roles);

            return { token, user, roles };
        } catch (error) {
            
            // Lấy thông báo lỗi từ error object
            const errorMessage = error.message || '';
            
            // Kiểm tra các trường hợp cụ thể dựa vào nội dung thông báo lỗi
            if (errorMessage.toLowerCase().includes('invalid username or password')) {
                throw new Error('Sai tên đăng nhập hoặc mật khẩu!');
            } else if (errorMessage.toLowerCase().includes('locked') || 
                       errorMessage.toLowerCase().includes('khóa')) {
                throw new Error('Tài khoản đã bị khóa!');
            } else if (errorMessage.toLowerCase().includes('deleted') || 
                       errorMessage.toLowerCase().includes('not exist') || 
                       errorMessage.toLowerCase().includes('không tồn tại')) {
                throw new Error('Tài khoản không tồn tại!');
            }
            
            // Nếu không phải các trường hợp đặc biệt, hiển thị thông báo gốc
            throw new Error('Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại!' || errorMessage);
        }
    },

    // Đăng ký
    register: async (userData) => {
        try {
            // Chuẩn bị FormData
            const formData = new FormData();
            formData.append('username', userData.username);
            formData.append('email', userData.email);
            formData.append('password', userData.password);
            formData.append('fullname', userData.fullName);
            formData.append('phone', userData.phone);
            formData.append('address', userData.address || '');

            // Kiểm tra avatar
            if (!userData.avatar) {
                throw new Error('Vui lòng chọn ảnh đại diện!');
            }

            // Xử lý File object
            const avatarFile = userData.avatar instanceof File ? userData.avatar : userData.avatar.originFileObj;
            if (!avatarFile) {
                throw new Error('File ảnh không hợp lệ!');
            }
            formData.append('avatar', avatarFile);

            // Gọi API đăng ký
            const response = await authFormDataApi.post('/sign-up', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            return response;
        } catch (error) {
            return handleAuthError(error);
        }
    },

    // Đăng xuất
    logout: () => {
        cookieManager.clearUserSession();
    },

    // Lấy thông tin người dùng hiện tại
    getCurrentUser: () => cookieManager.getUser(),

    // Lấy token
    getToken: () => cookieManager.getToken(),

    // Lấy vai trò
    getRoles: () => cookieManager.getRoles(),

    // Đổi mật khẩu
    changePassword: async (passwordData) => {
        try {
            const token = cookieManager.getToken();
            if (!token) {
                throw new Error('Bạn chưa đăng nhập!');
            }
            
            // Kiểm tra mật khẩu mới và mật khẩu hiện tại có giống nhau không
            if (passwordData.oldPass === passwordData.newPass) {
                throw new Error('Mật khẩu mới không được trùng với mật khẩu hiện tại!');
            }

            // Chuẩn bị dữ liệu
            const data = {
                oldPass: passwordData.oldPass,
                newPass: passwordData.newPass,
                confirmNewPass: passwordData.newPass
            };

            // Gọi API đổi mật khẩu
            return await userApi.put('/account/change-password', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            // Lấy thông báo lỗi từ error object
            const errorMessage = error.message || '';
            
            // Kiểm tra các trường hợp cụ thể
            if (errorMessage.toLowerCase().includes('same')) {
                throw new Error('Mật khẩu mới không được trùng với mật khẩu hiện tại!');
            } else if (errorMessage.toLowerCase().includes('incorrect')) {
                throw new Error('Mật khẩu hiện tại không chính xác!');
            } else if (errorMessage.toLowerCase().includes('do not match')) {
                throw new Error('Mật khẩu mới và xác nhận mật khẩu không khớp!');
            } else if (errorMessage.toLowerCase().includes('token') || 
                       errorMessage.toLowerCase().includes('phiên')) {
                throw new Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!');
            }
            
            // Nếu không phải các trường hợp đặc biệt, hiển thị thông báo gốc
            throw new Error(errorMessage || 'Có lỗi xảy ra khi đổi mật khẩu. Vui lòng thử lại!');
        }
    }
};

export default authService;
