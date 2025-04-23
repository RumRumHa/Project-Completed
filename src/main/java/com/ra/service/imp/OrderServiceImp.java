package com.ra.service.imp;

import com.ra.exception.CustomException;
import com.ra.mapper.OrderDetailMapper;
import com.ra.mapper.OrderMapper;
import com.ra.model.dto.response.OrderDetailResponseDTO;
import com.ra.model.dto.response.OrderResponseDTO;
import com.ra.model.dto.response.SalesRevenueOverTimeResponseDTO;
import com.ra.model.entity.EOrderStatus;
import com.ra.model.entity.Order;
import com.ra.model.entity.OrderDetail;
import com.ra.repository.OrderDetailRepository;
import com.ra.repository.OrderRepository;
import com.ra.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderServiceImp implements OrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    //Danh sách tất cả đơn hàng
    @Override
    public Page<OrderResponseDTO> getOrders(Pageable pageable) {
        Page<Order> orders = orderRepository.findAll(pageable);
        return orders.map(OrderMapper.INSTANCE::orderToOrderResponseDTO);
    }

    //Danh sách đơn hàng theo trạng thái
    @Override
    public Page<OrderResponseDTO> getOrderByStatus(String status, Pageable pageable) {
        Page<Order> orders = orderRepository.findByStatus(EOrderStatus.valueOf(status), pageable);
        return orders.map(OrderMapper.INSTANCE::orderToOrderResponseDTO);
    }

    //Chi tiết đơn hàng
    @Override
    public OrderResponseDTO getOrderById(Long orderId) {
        try {
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new CustomException("Order not found"));
            return OrderMapper.INSTANCE.orderToOrderResponseDTO(order);
        } catch (CustomException ce) {
            throw ce;
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while retrieving the order");
        }
    }

    @Override
    public List<OrderDetailResponseDTO> getOrderDetailsByOrderId(Long orderId) {
        try {
            List<OrderDetail> orderDetails = orderDetailRepository.findByOrderId(orderId);
            return orderDetails.stream()
                    .map(OrderDetailMapper.INSTANCE::orderDetailToOrderDetailResponseDTO)
                    .collect(Collectors.toList());
        } catch (CustomException ce) {
            throw ce;
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while retrieving the order details");
        }
    }

    //Cập nhật trạng thái đơn hàng (payload : orderStatus)
    @Override
    public OrderResponseDTO updateOrderStatus(Long orderId, String status) {
        if (status == null || status.isEmpty()) {
            throw new CustomException("Status cannot be null or empty");
        }
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new CustomException("Order not found"));
        if (!Arrays.stream(EOrderStatus.values()).map(Enum::name).anyMatch(status.toUpperCase()::equals)) {
            throw new CustomException("Invalid status value");
        }
        if (order.getStatus() == EOrderStatus.SUCCESS || order.getStatus() == EOrderStatus.CANCEL) {
            throw new CustomException("Order status cannot be updated to SUCCESS or CANCEL");
        }
        if (order.getStatus() == EOrderStatus.DELIVERY && status.equalsIgnoreCase("SUCCESS")) {
            order.setReceivedAt(new Date(System.currentTimeMillis()));
        }
        EOrderStatus orderStatus = EOrderStatus.valueOf(status.toUpperCase());
        order.setStatus(orderStatus);
        orderRepository.save(order);

        return OrderMapper.INSTANCE.orderToOrderResponseDTO(order);
    }

    //Doanh thu bán hàng theo thời gian (payload : from , to)
    @Override
    public List<SalesRevenueOverTimeResponseDTO> getSalesRevenueOverTime(Date from, Date to) {
        List<Order> orders = orderRepository.findByStatusAndCreatedAtBetween(EOrderStatus.SUCCESS, from, to);
        Map<Date, Double> revenueMap = new HashMap<>();
        for (Order order : orders) {
            Date orderDate = order.getCreatedAt();
            List<OrderDetail> orderDetails = orderDetailRepository.findByOrderId(order.getId());
            double totalRevenue = orderDetails.stream()
                    .mapToDouble(orderDetail -> orderDetail.getUnitPrice().doubleValue() * orderDetail.getOrderQuantity())
                    .sum();

            revenueMap.put(orderDate, revenueMap.getOrDefault(orderDate, 0.0) + totalRevenue);
        }

        List<SalesRevenueOverTimeResponseDTO> revenueData = revenueMap.entrySet().stream()
                .map(entry -> SalesRevenueOverTimeResponseDTO.builder()
                        .date(entry.getKey())
                        .totalRevenue(entry.getValue())
                        .build())
                .collect(Collectors.toList());

        revenueData.sort(Comparator.comparing(SalesRevenueOverTimeResponseDTO::getDate));
        return revenueData;
    }

    @Override
    public Page<OrderResponseDTO> searchByKeyword(String keyword, Pageable pageable) {
        Page<Order> orders = orderRepository.searchByKeyword(keyword, pageable);
        return orders.map(OrderMapper.INSTANCE::orderToOrderResponseDTO);
    }

    @Override
    public void deleteOrder(Long orderId) {
        try {
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new CustomException("Order not found"));
            orderRepository.delete(order);
        } catch (CustomException ce) {
            throw ce;
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while deleting the order");
        }
    }

}
