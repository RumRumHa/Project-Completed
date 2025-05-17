package com.ra.model.dto.response;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class CategoryResponseDTO {
    private Long categoryId;
    private String categoryName;
    private String description;
    private String avatar;
    private Boolean status;
}
