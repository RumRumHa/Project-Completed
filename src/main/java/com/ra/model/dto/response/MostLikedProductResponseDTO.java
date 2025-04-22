package com.ra.model.dto.response;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class MostLikedProductResponseDTO {
    private Long productId;
    private String productName;
    private Integer totalLikes;
}
