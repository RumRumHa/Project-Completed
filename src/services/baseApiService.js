import { BASE_URL, BASE_URL_ADMIN, BASE_URL_ADMIN_FORMDATA, BASE_URL_USER, BASE_URL_AUTH, BASE_URL_AUTH_FORMDATA } from '../api';

/**
 * Lớp cơ sở cho các dịch vụ API
 * Cung cấp các phương thức tiện ích để gọi API và xử lý lỗi
 */
export class BaseApiService {
  /**
   * Khởi tạo service với một instance axios
   * @param {Object} baseInstance - Instance axios đã được cấu hình
   * @param {Object} options - Các tùy chọn cho service
   * @param {number} options.maxRetries - Số lần thử lại tối đa khi gặp lỗi
   * @param {number} options.retryDelay - Thời gian chờ giữa các lần thử lại (ms)
   * @param {number} options.timeout - Thời gian timeout cho mỗi request (ms)
   */
  constructor(baseInstance, options = {}) {
    this.api = baseInstance;
    this.maxRetries = options.maxRetries || 3;
    this.retryDelay = options.retryDelay || 1000;
    this.timeout = options.timeout || 10000; // 10 giây mặc định
  }
  
  /**
   * Thực hiện request với cơ chế retry
   * @param {Function} requestFn - Hàm thực hiện request
   * @param {number} retries - Số lần thử lại còn lại
   * @returns {Promise<any>} Kết quả từ request
   * @private
   */
  async _executeWithRetry(requestFn, retries = this.maxRetries) {
    try {
      return await requestFn();
    } catch (error) {
      // Không retry nếu là lỗi 4xx (trừ 429 - Too Many Requests)
      if (error.response && error.response.status >= 400 && error.response.status < 500 && error.response.status !== 429) {
        throw error;
      }
      
      // Hết số lần retry
      if (retries <= 0) {
        throw error;
      }
      
      // Chờ một khoảng thời gian trước khi thử lại
      await new Promise(resolve => setTimeout(resolve, this.retryDelay));
      
      // Thử lại với số lần giảm đi 1
      return this._executeWithRetry(requestFn, retries - 1);
    }
  }

  /**
   * Xây dựng URL với các tham số truy vấn
   * @param {string} endpoint - Đường dẫn API
   * @param {Object} params - Các tham số truy vấn
   * @returns {string} URL đã được xây dựng
   */
  buildUrl(endpoint, { page = 1, limit = 10, sortBy, orderBy, keyword, ...otherParams } = {}) {
    let url = `${endpoint}?page=${page - 1}&limit=${limit}`;
    
    if (sortBy && orderBy) {
      url += `&sortBy=${sortBy}&orderBy=${orderBy}`;
    }
    
    if (keyword) {
      url += `&keyword=${keyword}`;
    }
    
    // Thêm các tham số khác nếu có
    Object.entries(otherParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url += `&${key}=${value}`;
      }
    });
    
    return url;
  }

  /**
   * Gọi API GET
   * @param {string} endpoint - Đường dẫn API
   * @param {Object} params - Các tham số truy vấn
   * @param {Object} config - Cấu hình cho request
   * @returns {Promise<any>} Dữ liệu từ API
   */
  async get(endpoint, params = {}, config = {}) {
    return this._executeWithRetry(async () => {
      try {
        let url;
        // Nếu params là một đối tượng rỗng, không cần xây dựng URL phức tạp
        if (Object.keys(params).length === 0) {
          url = endpoint;
        } else {
          url = this.buildUrl(endpoint, params);
        }
        
        // Thêm timeout vào config
        const requestConfig = {
          ...config,
          timeout: config.timeout || this.timeout
        };
        
        const response = await this.api.get(url, requestConfig);
        return response.data;
      } catch (error) {
        this.handleError(error);
      }
    });
  }

  /**
   * Gọi API GET theo ID
   * @param {string} endpoint - Đường dẫn API
   * @param {string|number} id - ID của đối tượng
   * @param {Object} params - Các tham số truy vấn bổ sung
   * @param {Object} config - Cấu hình cho request
   * @returns {Promise<any>} Dữ liệu từ API
   */
  async getById(endpoint, id, params = {}, config = {}) {
    return this._executeWithRetry(async () => {
      try {
        const url = `${endpoint}/${id}`;
        
        // Thêm timeout vào config
        const requestConfig = {
          ...config,
          timeout: config.timeout || this.timeout
        };
        
        const response = await this.api.get(url, requestConfig);
        return response.data;
      } catch (error) {
        this.handleError(error);
      }
    });
  }

  /**
   * Gọi API POST
   * @param {string} endpoint - Đường dẫn API
   * @param {any} data - Dữ liệu gửi lên
   * @param {Object} config - Cấu hình cho request
   * @returns {Promise<any>} Dữ liệu từ API
   */
  async post(endpoint, data, config = {}) {
    return this._executeWithRetry(async () => {
      try {
        // Thêm timeout vào config
        const requestConfig = {
          ...config,
          timeout: config.timeout || this.timeout
        };
        
        const response = await this.api.post(endpoint, data, requestConfig);
        return response.data;
      } catch (error) {
        this.handleError(error);
      }
    });
  }

  /**
   * Gọi API PUT
   * @param {string} endpoint - Đường dẫn API
   * @param {any} data - Dữ liệu gửi lên
   * @param {Object} config - Cấu hình cho request
   * @returns {Promise<any>} Dữ liệu từ API
   */
  async put(endpoint, data, config = {}) {
    return this._executeWithRetry(async () => {
      try {
        // Thêm timeout vào config
        const requestConfig = {
          ...config,
          timeout: config.timeout || this.timeout
        };
        
        const response = await this.api.put(endpoint, data, requestConfig);
        return response.data;
      } catch (error) {
        this.handleError(error);
      }
    });
  }

  /**
   * Gọi API DELETE
   * @param {string} endpoint - Đường dẫn API
   * @param {Object} config - Cấu hình cho request
   * @returns {Promise<any>} Dữ liệu từ API
   */
  async delete(endpoint, config = {}) {
    return this._executeWithRetry(async () => {
      try {
        // Thêm timeout vào config
        const requestConfig = {
          ...config,
          timeout: config.timeout || this.timeout
        };
        
        const response = await this.api.delete(endpoint, requestConfig);
        return response.data;
      } catch (error) {
        this.handleError(error);
      }
    });
  }

  /**
   * Xử lý lỗi từ API
   * @param {Error} error - Lỗi từ API
   * @throws {Error} Ném lỗi với thông báo từ API
   */
  handleError(error) {
    // Xử lý các loại lỗi khác nhau
    if (error.response) {
      // Lỗi từ server với mã trạng thái
      const status = error.response.status;
      const message = error.response.data?.message || error.response.data || 'Lỗi từ server';
      
      if (status === 401) {
        throw new Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
      } else if (status === 403) {
        throw new Error('Bạn không có quyền thực hiện thao tác này');
      } else if (status === 404) {
        throw new Error('Không tìm thấy tài nguyên yêu cầu');
      } else if (status === 400) {
        throw new Error(message);
      } else {
        throw new Error(message);
      }
    } else if (error.request) {
      // Yêu cầu đã được gửi nhưng không nhận được phản hồi
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
    } else {
      // Có lỗi khi thiết lập yêu cầu
      throw new Error(error.message || 'Có lỗi xảy ra');
    }
  }
}

// Tạo các instance cụ thể để sử dụng trong các service
export const publicApi = new BaseApiService(BASE_URL);
export const adminApi = new BaseApiService(BASE_URL_ADMIN);
export const adminFormDataApi = new BaseApiService(BASE_URL_ADMIN_FORMDATA);
export const userApi = new BaseApiService(BASE_URL_USER);
export const authApi = new BaseApiService(BASE_URL_AUTH);
export const authFormDataApi = new BaseApiService(BASE_URL_AUTH_FORMDATA);
