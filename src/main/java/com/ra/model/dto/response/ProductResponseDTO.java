package com.ra.model.dto.response;

import com.ra.model.entity.Category;
import lombok.*;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ProductResponseDTO {
    private Long productId;
    private String sku;
    private String productName;
    private String description;
    private BigDecimal unitPrice;
    private Integer stockQuantity;
    private String mainImageUrl;
    private List<String> images;
    private String categoryName;
    private Boolean isFeatured;
    private Long categoryId;
    private Date createdAt;
    private Date updatedAt;
}
