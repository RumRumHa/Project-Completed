package com.ra.model.dto.response;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class TopSpendingCustomerResponseDTO {
    private Long customerId;
    private String customerName;
    private Double totalSpent;
}
