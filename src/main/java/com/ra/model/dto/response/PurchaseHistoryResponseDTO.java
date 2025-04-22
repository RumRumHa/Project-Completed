package com.ra.model.dto.response;

import lombok.*;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class PurchaseHistoryResponseDTO {
    private Long orderId;
    private String serialNumber;
    private String orderDate;
    private String orderStatus;
    private Double totalPrice;
    private String receiveName;
    private String note;
    private String receivePhone;
    private String receiveAddress;
    private List<OrderDetailResponseDTO> orderDetails;
}
