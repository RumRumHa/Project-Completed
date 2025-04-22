package com.ra.model.dto.request;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ProductRequestDTO {
    private String sku;
    private String productName;
    private String description;
    private BigDecimal unitPrice;
    private Integer stockQuantity;
    private MultipartFile mainImageUrl;
    private List<MultipartFile> images;
    private Long categoryId;
    private String categoryName;
    private Boolean isFeatured;
}
