package com.ra.repository;

import com.ra.model.entity.Category;
import com.ra.model.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    boolean existsByCategoryCategoryId(Long categoryId);
    @Query("SELECT p FROM Product p WHERE LOWER(p.productName) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "OR LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Product> searchProductByProductNameOrDescription(String query, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.isFeatured = true")
    Page<Product> findFeaturedProducts(org.springframework.data.domain.Pageable pageable);

    @Query("SELECT p FROM Product p ORDER BY p.createdAt DESC")
    Page<Product> findNewProducts(Pageable pageable);

    Page<Product> findByCategoryCategoryId(Long categoryId, Pageable pageable);
    @Query(value = "SELECT * FROM products " +
            "WHERE (LOWER(remove_accents(product_name)) LIKE LOWER(CONCAT('%', remove_accents(:keyword), '%')) " +
            "OR LOWER(remove_accents(description)) LIKE LOWER(CONCAT('%', remove_accents(:keyword), '%')))",
            countQuery = "SELECT COUNT(*) FROM products " +
                    "WHERE (LOWER(remove_accents(product_name)) LIKE LOWER(CONCAT('%', remove_accents(:keyword), '%')) " +
                    "OR LOWER(remove_accents(description)) LIKE LOWER(CONCAT('%', remove_accents(:keyword), '%')))",
            nativeQuery = true)
    Page<Product> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
}
