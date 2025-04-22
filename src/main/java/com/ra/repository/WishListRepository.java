package com.ra.repository;

import com.ra.model.entity.WishList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface WishListRepository extends JpaRepository<WishList, Long> {
    List<WishList> findByCreatedAtBetween(Date from, Date to);
    Optional<WishList> findByUserUserIdAndProductProductId(Long userId, Long productId);
    Boolean existsByUserUserIdAndProductProductId(Long userId, Long productId);
    Boolean existsByUserUserIdAndWishListId(Long userId, Long wishListId);
    List<WishList> findByUserUserId(Long userId);
}