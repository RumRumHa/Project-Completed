package com.ra.controller;

import com.ra.model.dto.response.BestSellerProductResponseDTO;
import com.ra.model.dto.response.ProductResponseDTO;
import com.ra.model.dto.response.UserResponseDTO;
import com.ra.model.dto.request.ProductRequestDTO;
import com.ra.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("api/v1/products")
public class ProductController {
    @Autowired
    private ProductService productService;

    private Pageable getPageable(int page, int limit, String sortBy, String orderBy) {
        Sort.Direction direction = "asc".equalsIgnoreCase(orderBy)
                ? Sort.Direction.ASC : Sort.Direction.DESC;
        Sort sort = Sort.by(direction, sortBy);
        return PageRequest.of(page, limit, sort);
    }

    //Lấy về danh sách tất cả sản phẩm (sắp xếp và phân trang)
    @GetMapping
    public ResponseEntity<Page<ProductResponseDTO>> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "productName") String sortBy,
            @RequestParam(defaultValue = "asc") String orderBy
    ) {
        Pageable pageable = getPageable(page, limit, sortBy, orderBy);
        return ResponseEntity.ok(productService.getProducts(pageable));
    }

    //Tìm kiếm sản phẩm theo tên hoặc mô tả
    @GetMapping("/search")
    public ResponseEntity<Page<ProductResponseDTO>> searchProductByProductNameOrDescription(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit
    ) {
        Pageable pageable = PageRequest.of(page, limit);
        Page<ProductResponseDTO> result = productService.searchByKeyword(keyword, pageable);
        return ResponseEntity.ok(result);
    }

    //Danh sách sản phẩm nổi bật
    @GetMapping("/featured-products")
    public ResponseEntity<Page<ProductResponseDTO>> getFeaturedProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "productName") String sortBy,
            @RequestParam(defaultValue = "asc") String orderBy
    ) {
        Pageable pageable = getPageable(page, limit, sortBy, orderBy);
        return ResponseEntity.ok(productService.getFeaturedProducts(pageable));
    }

    //Danh sách sản phẩm mới
    @GetMapping("/new-products")
    public ResponseEntity<Page<ProductResponseDTO>> getNewProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String orderBy
    ) {
        Pageable pageable = getPageable(page, limit, sortBy, orderBy);
        return ResponseEntity.ok(productService.getNewProducts(pageable));
    }

    //Danh sách sản phẩm bán chạy
    @GetMapping("/best-seller-products")
    public ResponseEntity<Page<BestSellerProductResponseDTO>> getBestSellerProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "totalQuantity") String sortBy,
            @RequestParam(defaultValue = "desc") String orderBy
    ) {
        Pageable pageable = getPageable(page, limit, sortBy, orderBy);
        return ResponseEntity.ok(productService.getBestSellerProducts(pageable));
    }

    //Danh sách sản phẩm theo danh mục
    @GetMapping("/categories/{categoryId}")
    public ResponseEntity<Page<ProductResponseDTO>> getProductsByCategoryId(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "productName") String sortBy,
            @RequestParam(defaultValue = "asc") String orderBy
    ) {
        Pageable pageable = getPageable(page, limit, sortBy, orderBy);
        return ResponseEntity.ok(productService.getProductsByCategoryId(categoryId, pageable));
    }

    //Chi tiết thông tin sản phẩm theo id
    @GetMapping("/{productId}")
    public ResponseEntity<ProductResponseDTO> getProductById(@PathVariable Long productId) {
        return ResponseEntity.ok(productService.getProductById(productId));
    }

    //Thêm mới sản phẩm
    @PostMapping
    public ResponseEntity<ProductResponseDTO> createProduct(@Valid @ModelAttribute ProductRequestDTO productRequestDTO) {
        ProductResponseDTO newProduct = productService.addProduct(productRequestDTO);
        return new ResponseEntity<>(newProduct, HttpStatus.CREATED);
    }

    //Cập nhật sản phẩm
    @PutMapping("/{productId}")
    public ResponseEntity<ProductResponseDTO> updateProduct(@PathVariable Long productId, @Valid @ModelAttribute ProductRequestDTO productRequestDTO) {
        ProductResponseDTO updatedProduct = productService.updateProduct(productId, productRequestDTO);
        return ResponseEntity.ok(updatedProduct);
    }
}
