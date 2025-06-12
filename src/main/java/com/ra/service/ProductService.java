package com.ra.service;

import com.ra.model.dto.request.ProductRequestDTO;
import com.ra.model.dto.response.BestSellerProductResponseDTO;
import com.ra.model.dto.response.ProductResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductService {
    Page<ProductResponseDTO> getProducts(Pageable pageable);
    ProductResponseDTO getProductById(Long productId);
    ProductResponseDTO addProduct(ProductRequestDTO productRequestDTO);
    ProductResponseDTO updateProduct(Long productId, ProductRequestDTO productRequestDTO);
    boolean deleteProduct(Long productId);
    Page<ProductResponseDTO> searchProductByProductNameOrDescription(String keyword, Pageable pageable);
    Page<ProductResponseDTO> getFeaturedProducts(Pageable pageable);
    Page<ProductResponseDTO> getNewProducts(Pageable pageable);
    Page<BestSellerProductResponseDTO> getBestSellerProducts(Pageable pageable);
    Page<ProductResponseDTO> getProductsByCategoryId(Long categoryId, Pageable pageable);
    Page<ProductResponseDTO> searchByKeyword(String keyword, Pageable pageable);
}
