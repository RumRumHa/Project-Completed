package com.ra.model.dto.response;

import lombok.*;

import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class OrderDetailResponseDTO {
    private Long orderDetailId;
    private Long productId;
    private String productName;
    private BigDecimal unitPrice;
    private Integer orderQuantity;
    private BigDecimal totalPrice;
    private String mainImageUrl;
}
