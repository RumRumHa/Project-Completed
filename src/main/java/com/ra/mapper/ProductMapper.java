package com.ra.mapper;

import com.ra.model.dto.response.ProductResponseDTO;
import com.ra.model.entity.Product;
import com.ra.model.entity.ProductImage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.Collections;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    ProductMapper INSTANCE = Mappers.getMapper(ProductMapper.class);

    default ProductResponseDTO productToProductResponseDTO(Product product) {
        if (product == null) {
            return null;
        }

        ProductResponseDTO responseDTO = new ProductResponseDTO();
        responseDTO.setProductId(product.getProductId());
        responseDTO.setSku(product.getSku());
        responseDTO.setProductName(product.getProductName());
        responseDTO.setDescription(product.getDescription());
        responseDTO.setUnitPrice(product.getUnitPrice());
        responseDTO.setStockQuantity(product.getStockQuantity());

        if (product.getImages() != null) {
            responseDTO.setImages(product.getImages().stream()
                    .map(ProductImage::getImage)
                    .toList());
        } else {
            responseDTO.setImages(Collections.emptyList());
        }

        if (product.getCategory() != null) {
            responseDTO.setCategoryName(product.getCategory().getCategoryName());
            responseDTO.setCategoryId(product.getCategory().getCategoryId());
        }
        responseDTO.setIsFeatured(product.getIsFeatured());
        responseDTO.setMainImageUrl(product.getMainImageUrl());
        responseDTO.setCreatedAt(product.getCreatedAt());
        responseDTO.setUpdatedAt(product.getUpdatedAt());
        return responseDTO;
    }
}
