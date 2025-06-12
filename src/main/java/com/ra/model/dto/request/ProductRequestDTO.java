package com.ra.model.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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

    @NotBlank(message = "Product name cannot be blank")
    private String productName;

    private String description;

    @NotNull(message = "Unit price cannot be null")
    @Min(value = 0, message = "Unit price must be non-negative")
    private BigDecimal unitPrice;

    @NotNull(message = "Stock quantity cannot be null")
    @Min(value = 0, message = "Stock quantity must be non-negative")
    private Integer stockQuantity;

    private MultipartFile mainImageUrl;

    private List<MultipartFile> images;

    @NotNull(message = "Category ID cannot be null")
    private Long categoryId;

    private String categoryName;

    private Boolean isFeatured;
}
