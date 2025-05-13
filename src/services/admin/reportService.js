import { adminApi } from "../../services/baseApiService";

/**
 * Dịch vụ báo cáo cho trang quản trị
 * Sử dụng cách tiếp cận đối tượng thay vì các hàm riêng lẻ
 */
export const reportService = {
    /**
     * Lấy dữ liệu doanh thu bán hàng theo thời gian
     * @param {string} from - Ngày bắt đầu
     * @param {string} to - Ngày kết thúc
     * @returns {Promise<any>} Dữ liệu doanh thu
     */
    getSalesRevenueOverTime: async (from, to) => {
        return adminApi.get('/reports/sales-revenue-over-time', { from, to });
    },

    /**
     * Lấy danh sách sản phẩm bán chạy nhất
     * @param {string} from - Ngày bắt đầu
     * @param {string} to - Ngày kết thúc
     * @returns {Promise<any>} Danh sách sản phẩm bán chạy
     */
    getBestSellerProducts: async (from, to) => {
        return adminApi.get('/reports/best-seller-products', { from, to });
    },

    /**
     * Lấy danh sách sản phẩm được yêu thích nhất
     * @param {string} from - Ngày bắt đầu
     * @param {string} to - Ngày kết thúc
     * @returns {Promise<any>} Danh sách sản phẩm được yêu thích
     */
    getMostLikedProducts: async (from, to) => {
        return adminApi.get('/reports/most-liked-products', { from, to });
    },

    /**
     * Lấy doanh thu theo danh mục
     * @param {Object} params - Các tham số truy vấn
     * @returns {Promise<any>} Dữ liệu doanh thu theo danh mục
     */
    getRevenueByCategory: async (params) => {
        return adminApi.get('/reports/revenue-by-category', params);
    },

    /**
     * Lấy danh sách khách hàng chi tiêu nhiều nhất
     * @param {string} from - Ngày bắt đầu
     * @param {string} to - Ngày kết thúc
     * @returns {Promise<any>} Danh sách khách hàng
     */
    getTopSpendingCustomers: async (from, to) => {
        return adminApi.get('/reports/top-spending-customers', { from, to });
    },

    /**
     * Lấy số lượng tài khoản mới trong tháng
     * @param {number} month - Tháng
     * @param {number} year - Năm
     * @returns {Promise<any>} Số lượng tài khoản mới
     */
    getNewAccountsThisMonth: async (month, year) => {
        return adminApi.get('/reports/new-accounts-this-month', { month, year });
    },

    /**
     * Lấy số lượng hóa đơn theo thời gian
     * @param {string} from - Ngày bắt đầu
     * @param {string} to - Ngày kết thúc
     * @returns {Promise<any>} Dữ liệu hóa đơn
     */
    getInvoicesOverTime: async (from, to) => {
        return adminApi.get('/reports/invoices-over-time', { from, to });
    }
};