package com.ra.model.dto.response;

import com.ra.model.entity.Product;
import com.ra.model.entity.User;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ShoppingCartResponseDTO {
    private Long shoppingCartId;
    private Long productId;
    private String productName;
    private BigDecimal unitPrice;
    private String mainImageUrl;
    private Integer orderQuantity;
}
