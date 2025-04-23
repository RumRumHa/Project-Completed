import { BASE_URL_ADMIN } from "../../api/index";

const getSalesRevenueOverTime = async (from, to) => {
    const response = await BASE_URL_ADMIN.get('/reports/sales-revenue-over-time', {
        params: { from, to }
    });
    return response.data;
};

const getBestSellerProducts = async (from, to) => {
    const response = await BASE_URL_ADMIN.get('/reports/best-seller-products', {
        params: { from, to }
    });
    return response.data;
};

const getMostLikedProducts = async (from, to) => {
    const response = await BASE_URL_ADMIN.get('/reports/most-liked-products', {
        params: { from, to }
    });
    return response.data;
};

const getRevenueByCategory = async (params) => {
    const response = await BASE_URL_ADMIN.get('/reports/revenue-by-category', {
        params
    });
    return response.data;
};

const getTopSpendingCustomers = async (from, to) => {
    const response = await BASE_URL_ADMIN.get('/reports/top-spending-customers', {
        params: { from, to }
    });
    return response.data;
};

const getNewAccountsThisMonth = async (month, year) => {
    const response = await BASE_URL_ADMIN.get('/reports/new-accounts-this-month', {
        params: { month, year }
    });
    return response.data;
};

const getInvoicesOverTime = async (from, to) => {
    const response = await BASE_URL_ADMIN.get('/reports/invoices-over-time', {
        params: { from, to }
    });
    return response.data;
};

export const reportService = {
    getSalesRevenueOverTime,
    getBestSellerProducts,
    getMostLikedProducts,
    getRevenueByCategory,
    getTopSpendingCustomers,
    getNewAccountsThisMonth,
    getInvoicesOverTime
}; 