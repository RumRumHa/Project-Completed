package com.ra.mapper;

import com.ra.model.dto.response.ShoppingCartResponseDTO;
import com.ra.model.entity.ProductImage;
import com.ra.model.entity.ShoppingCart;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface CartMapper {
    CartMapper INSTANCE = Mappers.getMapper(CartMapper.class);
    default ShoppingCartResponseDTO toResponseDTO(ShoppingCart shoppingCart) {
        ShoppingCartResponseDTO responseDTO = new ShoppingCartResponseDTO();
        responseDTO.setShoppingCartId(shoppingCart.getShoppingCartId());
        responseDTO.setOrderQuantity(shoppingCart.getOrderQuantity());
        if (shoppingCart.getProduct() != null) {
            responseDTO.setProductId(shoppingCart.getProduct().getProductId());
            responseDTO.setProductName(shoppingCart.getProduct().getProductName());
            responseDTO.setUnitPrice(shoppingCart.getProduct().getUnitPrice());

            if (shoppingCart.getProduct().getMainImageUrl() != null) {
                responseDTO.setMainImageUrl(shoppingCart.getProduct().getMainImageUrl());
            }
        }
        return responseDTO;
    }
}
