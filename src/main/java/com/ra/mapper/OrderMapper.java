package com.ra.mapper;

import com.ra.model.dto.response.OrderResponseDTO;
import com.ra.model.entity.Order;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring")
@Component
public interface OrderMapper {
    OrderMapper INSTANCE = Mappers.getMapper(OrderMapper.class);

    default OrderResponseDTO orderToOrderResponseDTO(Order order) {
        OrderResponseDTO responseDTO = new OrderResponseDTO();
        responseDTO.setOrderId(order.getId());
        responseDTO.setSerialNumber(order.getSerialNumber());
        responseDTO.setUserId(order.getUser().getUserId());
        responseDTO.setUserName(order.getUser().getUsername());
        responseDTO.setTotalPrice(order.getTotalPrice());
        responseDTO.setStatus(order.getStatus());
        responseDTO.setNote(order.getNote());
        responseDTO.setReceiveName(order.getReceiveName());
        responseDTO.setReceiveAddress(order.getReceiveAddress());
        responseDTO.setReceivePhone(order.getReceivePhone());
        responseDTO.setCreatedAt(order.getCreatedAt());
        responseDTO.setReceivedAt(order.getReceivedAt());
        responseDTO.setOrderDetails(order.getOrderDetails().stream()
                .map(OrderDetailMapper.INSTANCE::orderDetailToOrderDetailResponseDTO)
                .toList());
        return responseDTO;
    }
}
