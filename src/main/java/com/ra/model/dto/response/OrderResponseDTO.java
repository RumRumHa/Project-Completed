package com.ra.model.dto.response;

import com.ra.model.entity.EOrderStatus;
import lombok.*;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class OrderResponseDTO {
    private Long orderId;
    private String serialNumber;
    private Long userId;
    private String userName;
    private BigDecimal totalPrice;
    private EOrderStatus status;
    private String note;
    private String receiveName;
    private String receiveAddress;
    private String receivePhone;
    private Date createdAt;
    private Date receivedAt;
    private List<OrderDetailResponseDTO> orderDetails;
}
