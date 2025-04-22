package com.ra.service.imp;

import com.ra.exception.CustomException;
import com.ra.mapper.ProductMapper;
import com.ra.model.dto.request.ProductRequestDTO;
import com.ra.model.dto.response.BestSellerProductResponseDTO;
import com.ra.model.dto.response.ProductResponseDTO;
import com.ra.model.entity.*;
import com.ra.repository.CategoryRepository;
import com.ra.repository.OrderDetailRepository;
import com.ra.repository.OrderRepository;
import com.ra.repository.ProductRepository;
import com.ra.service.CloudinaryService;
import com.ra.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProductServiceImp implements ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    //Lấy về danh sách tất cả sản phẩm (sắp xếp và phân trang)
    @Override
    public Page<ProductResponseDTO> getProducts(Pageable pageable) {
        Page<Product> products = productRepository.findAll(pageable);
        return products.map(ProductMapper.INSTANCE::productToProductResponseDTO);
    }

    //Lấy về thông tin sản phẩm theo id
    @Override
    public ProductResponseDTO getProductById(Long productId) {
        try {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new CustomException("Product not found"));
            ProductResponseDTO productDTO = ProductMapper.INSTANCE.productToProductResponseDTO(product);
            productDTO.setImages(product.getImages().stream()
                    .map(ProductImage::getImage)
                    .collect(Collectors.toList()));

            return productDTO;
        } catch (CustomException ce) {
            throw ce;
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while retrieving the product");
        }
    }

    //Thêm mới sản phẩm
    @Override
    public ProductResponseDTO addProduct(ProductRequestDTO productRequestDTO) {
        try {
            Category category = categoryRepository.findById(productRequestDTO.getCategoryId())
                    .orElseThrow(() -> new CustomException("Category not found"));

            Product product = Product.builder()
                    .sku(productRequestDTO.getSku())
                    .productName(productRequestDTO.getProductName())
                    .description(productRequestDTO.getDescription())
                    .unitPrice(productRequestDTO.getUnitPrice())
                    .stockQuantity(productRequestDTO.getStockQuantity())
                    .category(category)
                    .isFeatured(productRequestDTO.getIsFeatured())
                    .createdAt(new Date())
                    .updatedAt(new Date())
                    .images(new HashSet<>())
                    .build();
            // Tải lên hình ảnh chính
            if (productRequestDTO.getMainImageUrl() != null && !productRequestDTO.getMainImageUrl().isEmpty()) {
                String mainImageUrl = cloudinaryService.uploadFile(productRequestDTO.getMainImageUrl());
                product.setMainImageUrl(mainImageUrl);
            }

            // Tải lên hình ảnh phụ
            if (productRequestDTO.getImages() != null && !productRequestDTO.getImages().isEmpty()) {
                List<String> imageUrls = cloudinaryService.uploadFiles(productRequestDTO.getImages());
                for (String imageUrl : imageUrls) {
                    ProductImage productImage = ProductImage.builder()
                            .image(imageUrl)
                            .product(product)
                            .build();
                    product.getImages().add(productImage);
                }
            }

            Product savedProduct = productRepository.save(product);

            return ProductMapper.INSTANCE.productToProductResponseDTO(savedProduct);
        } catch (CustomException ce) {
            ce.printStackTrace();
            throw ce;
        } catch (Exception e) {
            e.printStackTrace();
            throw new CustomException("An unexpected error occurred while adding the product");
        }
    }

    //Chỉnh sửa thông tin sản phẩm
    @Override
    public ProductResponseDTO updateProduct(Long productId, ProductRequestDTO productRequestDTO) {
        try {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new CustomException("Product not found"));

            Category category = categoryRepository.findById(productRequestDTO.getCategoryId())
                    .orElseThrow(() -> new CustomException("Category not found"));

            product.setSku(productRequestDTO.getSku());
            product.setProductName(productRequestDTO.getProductName());
            product.setDescription(productRequestDTO.getDescription());
            product.setUnitPrice(productRequestDTO.getUnitPrice());
            product.setStockQuantity(productRequestDTO.getStockQuantity());
            product.setIsFeatured(productRequestDTO.getIsFeatured());
            product.setCategory(category);
            product.setUpdatedAt(new Date());

            // Tải lên hình ảnh chính
            if (productRequestDTO.getMainImageUrl() != null && !productRequestDTO.getMainImageUrl().isEmpty()) {
                String mainImageUrl = cloudinaryService.uploadFile(productRequestDTO.getMainImageUrl());
                product.setMainImageUrl(mainImageUrl);
            }

            // Kiểm tra xem có file ảnh mới được tải lên không
            if (productRequestDTO.getImages() != null && !productRequestDTO.getImages().isEmpty()) {
                // Clear existing images
                product.getImages().clear();

                // Tải lên hình ảnh phụ
                List<String> newImageUrls = cloudinaryService.uploadFiles(productRequestDTO.getImages());
                for (String imageUrl : newImageUrls) {
                    ProductImage productImage = ProductImage.builder()
                            .image(imageUrl)
                            .product(product)
                            .build();
                    product.getImages().add(productImage);
                }
            }

            Product updatedProduct = productRepository.save(product);
            return ProductMapper.INSTANCE.productToProductResponseDTO(updatedProduct);
        } catch (CustomException ce) {
            throw ce;
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while updating the product");
        }
    }

    //Xóa sản phẩm
    @Override
    public boolean deleteProduct(Long productId) {
        try {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new CustomException("Product not found"));
            productRepository.delete(product);
            return true;
        } catch (CustomException ce) {
            throw ce;
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while deleting the product");
        }
    }

    //Tìm kiếm sản phẩm theo tên hoặc mô tả
    @Override
    public Page<ProductResponseDTO> searchProductByProductNameOrDescription(String keyword, Pageable pageable) {
        try {
            Page<Product> products = productRepository.searchByKeyword(keyword, pageable);
            return products.map(ProductMapper.INSTANCE::productToProductResponseDTO);
        } catch (CustomException ce) {
            throw ce;
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while searching for products");
        }
    }

    // Danh sách sản phẩm nổi bật
    @Override
    public Page<ProductResponseDTO> getFeaturedProducts(Pageable pageable) {
        try {
            Page<Product> featuredProducts = productRepository.findFeaturedProducts(pageable);
            return featuredProducts.map(ProductMapper.INSTANCE::productToProductResponseDTO);
        } catch (CustomException ce) {
            throw ce;
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while retrieving the featured products");
        }
    }

    // Danh sách sản phẩm mới
    @Override
    public Page<ProductResponseDTO> getNewProducts(Pageable pageable) {
        try {
            Page<Product> newProducts = productRepository.findNewProducts(pageable);
            return newProducts.map(ProductMapper.INSTANCE::productToProductResponseDTO);
        } catch (CustomException ce) {
            throw ce;
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while retrieving the new products");
        }
    }

    // Danh sách sản phẩm bán chạy
    @Override
    public Page<ProductResponseDTO> getBestSellerProducts(Pageable pageable) {
        try {
            List<Order> orders = orderRepository.findByStatus(EOrderStatus.SUCCESS);

            Map<Long, BestSellerProductResponseDTO> productMap = new HashMap<>();

            // Tính toán tổng số lượng bán của từng sản phẩm
            for (Order order : orders) {
                List<OrderDetail> orderDetails = orderDetailRepository.findByOrderId(order.getId());

                for (OrderDetail orderDetail : orderDetails) {
                    Long productId = orderDetail.getProduct().getProductId();
                    String productName = orderDetail.getProduct().getProductName();
                    int quantity = orderDetail.getOrderQuantity();

                    BestSellerProductResponseDTO productDTO = productMap.get(productId);
                    if (productDTO == null) {
                        productDTO = BestSellerProductResponseDTO.builder()
                                .productId(productId)
                                .productName(productName)
                                .totalQuantity(quantity)
                                .build();
                        productMap.put(productId, productDTO);
                    } else {
                        productDTO.setTotalQuantity(productDTO.getTotalQuantity() + quantity);
                    }
                }
            }

            List<BestSellerProductResponseDTO> bestSellerProducts = new ArrayList<>(productMap.values());

            // Sắp xếp danh sách theo tổng số lượng bán giảm dần
            bestSellerProducts.sort(Comparator.comparing(BestSellerProductResponseDTO::getTotalQuantity).reversed());

            // Phân trang danh sách sản phẩm bán chạy
            int start = (int) pageable.getOffset();
            int end = Math.min((start + pageable.getPageSize()), bestSellerProducts.size());

            List<BestSellerProductResponseDTO> bestSellerPage = bestSellerProducts.subList(start, end);

            // Chuyển đổi danh sách BestSellerProductResponseDTO thành ProductResponseDTO
            List<ProductResponseDTO> productResponseDTOs = bestSellerPage.stream()
                    .map(b -> {
                        Product product = productRepository.findById(b.getProductId())
                                .orElseThrow(() -> new CustomException("Product not found"));
                        return ProductMapper.INSTANCE.productToProductResponseDTO(product);
                    })
                    .collect(Collectors.toList());

            Page<ProductResponseDTO> page = new PageImpl<>(productResponseDTOs, pageable, bestSellerProducts.size());

            return page;
        } catch (Exception e) {
            e.printStackTrace();
            throw new CustomException("An unexpected error occurred while retrieving best seller products");
        }
    }

    //Danh sách sản phẩm theo danh mục
    @Override
    public Page<ProductResponseDTO> getProductsByCategoryId(Long categoryId, Pageable pageable) {
        try {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new CustomException("Category not found"));

            Page<Product> products = productRepository.findByCategoryCategoryId(categoryId, pageable);
            return products.map(ProductMapper.INSTANCE::productToProductResponseDTO);
        } catch (CustomException ce) {
            throw ce;
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while retrieving products by category");
        }
    }

    @Override
    public Page<ProductResponseDTO> searchByKeyword(String keyword, Pageable pageable) {
        Page<Product> products = productRepository.searchByKeyword(keyword, pageable);
        return products.map(product -> ProductMapper.INSTANCE.productToProductResponseDTO(product));
    }
}
