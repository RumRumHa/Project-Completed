package com.ra.repository;

import com.ra.model.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Page<Category> findAllByStatusTrue(Pageable pageable);
    boolean existsByCategoryId(Long categoryId);
    @Query(value = "SELECT * FROM categories " +
            "WHERE status = true AND " +
            "(LOWER(remove_accents(category_name)) LIKE LOWER(CONCAT('%', remove_accents(:keyword), '%')) " +
            "OR LOWER(remove_accents(description)) LIKE LOWER(CONCAT('%', remove_accents(:keyword), '%')))",
            countQuery = "SELECT COUNT(*) FROM categories " +
                    "WHERE status = true AND " +
                    "(LOWER(remove_accents(category_name)) LIKE LOWER(CONCAT('%', remove_accents(:keyword), '%')) " +
                    "OR LOWER(remove_accents(description)) LIKE LOWER(CONCAT('%', remove_accents(:keyword), '%')))",
            nativeQuery = true)
    Page<Category> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
}
