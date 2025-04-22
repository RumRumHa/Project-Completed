package com.ra.service;

import com.ra.model.dto.response.OrderDetailResponseDTO;
import com.ra.model.dto.response.OrderResponseDTO;
import com.ra.model.dto.response.ProductResponseDTO;
import com.ra.model.dto.response.SalesRevenueOverTimeResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Date;
import java.util.List;

public interface OrderService {
    Page<OrderResponseDTO> getOrders(Pageable pageable);
    Page<OrderResponseDTO> getOrderByStatus(String status, Pageable pageable);
    OrderResponseDTO getOrderById(Long orderId);
    List<OrderDetailResponseDTO> getOrderDetailsByOrderId(Long orderId);
    OrderResponseDTO updateOrderStatus(Long orderId, String status);
    List<SalesRevenueOverTimeResponseDTO> getSalesRevenueOverTime(Date from, Date to);
    Page<OrderResponseDTO> searchByKeyword(String keyword, Pageable pageable);
    void deleteOrder(Long orderId);
}
