package com.ra.service;

import com.ra.model.dto.response.*;

import java.util.Date;
import java.util.List;

public interface ReportService {
    List<BestSellerProductResponseDTO> getBestSellerProducts(Date from, Date to);
    List<MostLikedProductResponseDTO> getMostLikedProducts(Date from, Date to);
    List<RevenueByCategoryResponseDTO> getRevenueByCategory(Date from, Date to);
    List<RevenueByCategoryResponseDTO> getRevenueByCategoryByYear(Integer year);
    List<RevenueByCategoryResponseDTO> getRevenueByCategoryByMonth(Integer month);
    List<RevenueByCategoryResponseDTO> getRevenueByCategoryOverall();
    List<TopSpendingCustomerResponseDTO> getTopSpendingCustomers(Date from, Date to);
    List<UserResponseDTO> getNewAccountsThisMonth(Integer month, Integer year);
    List<InvoiceCountResponseDTO> getInvoicesOverTime(Date from, Date to);
}
