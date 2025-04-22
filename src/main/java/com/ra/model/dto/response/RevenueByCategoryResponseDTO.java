package com.ra.model.dto.response;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class RevenueByCategoryResponseDTO {
    private Long categoryId;
    private String categoryName;
    private Double totalRevenue;
}
