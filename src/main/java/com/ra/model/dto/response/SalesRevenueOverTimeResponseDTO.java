package com.ra.model.dto.response;

import lombok.*;

import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class SalesRevenueOverTimeResponseDTO {
    private Date date;
    private Double totalRevenue;
}
