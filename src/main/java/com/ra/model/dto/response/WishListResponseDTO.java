package com.ra.model.dto.response;

import lombok.*;

import java.util.Date;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class WishListResponseDTO {
    private Long wishListId;
    private Long userId;
    private Long productId;
    private String productName;
    private String productDescription;
    private Double productPrice;
    private List<String> productImage;
    private Date createdAt;
}
