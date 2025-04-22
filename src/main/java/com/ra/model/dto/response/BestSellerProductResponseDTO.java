package com.ra.model.dto.response;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class BestSellerProductResponseDTO {
    private Long productId;
    private String productName;
    private Integer totalQuantity;
    private Double totalRevenue;
}
