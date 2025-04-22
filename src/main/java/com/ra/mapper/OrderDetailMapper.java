package com.ra.mapper;

import com.ra.model.dto.response.OrderDetailResponseDTO;
import com.ra.model.entity.OrderDetail;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Mapper(componentModel = "spring")
@Component
public interface OrderDetailMapper {
    OrderDetailMapper INSTANCE = Mappers.getMapper(OrderDetailMapper.class);

    default OrderDetailResponseDTO orderDetailToOrderDetailResponseDTO(OrderDetail orderDetail) {
        if (orderDetail == null) {
            return null;
        }

        return OrderDetailResponseDTO.builder()
                .orderDetailId(orderDetail.getId())
                .productId(orderDetail.getProduct().getProductId())
                .productName(orderDetail.getProduct().getProductName())
                .unitPrice(orderDetail.getUnitPrice())
                .orderQuantity(orderDetail.getOrderQuantity())
                .mainImageUrl(orderDetail.getProduct().getMainImageUrl())
                .totalPrice(orderDetail.getUnitPrice().multiply(BigDecimal.valueOf(orderDetail.getOrderQuantity())))
                .build();
    }
}
