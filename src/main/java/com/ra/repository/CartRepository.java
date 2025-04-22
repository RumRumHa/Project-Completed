package com.ra.repository;

import com.ra.model.entity.ShoppingCart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartRepository extends JpaRepository<ShoppingCart, Long> {
    List<ShoppingCart> findByUserUserIdAndProductProductId(Long userId, Long productId);
    List<ShoppingCart> findByUserUserId(Long userId);

    @Modifying
    @Query("DELETE FROM ShoppingCart c WHERE c.user.userId = :userId")
    void deleteByUserUserId(@Param("userId") Long userId);
}
