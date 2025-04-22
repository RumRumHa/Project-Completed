package com.ra.mapper;

import com.ra.model.dto.response.WishListResponseDTO;
import com.ra.model.entity.Product;
import com.ra.model.entity.ProductImage;
import com.ra.model.entity.WishList;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface WishListMapper {
    WishListMapper INSTANCE = Mappers.getMapper(WishListMapper.class);

    default WishListResponseDTO toResponseDTO(WishList wishlist) {
        if (wishlist == null) {
            return null;
        }

        Product product = wishlist.getProduct();
        if (product == null) {
            return null;
        }
        List<String> productImages = product.getImages().stream()
                .map(ProductImage::getImage)
                .collect(Collectors.toList());

        return WishListResponseDTO.builder()
                .wishListId(wishlist.getWishListId())
                .userId(wishlist.getUser().getUserId())
                .productId(product.getProductId())
                .productName(product.getProductName())
                .productDescription(product.getDescription())
                .productPrice(product.getUnitPrice().doubleValue())
                .productImage(productImages)
                .createdAt(wishlist.getCreatedAt())
                .build();
    }
}
