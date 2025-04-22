package com.ra.service;

import com.ra.model.dto.response.WishListResponseDTO;

import java.util.List;

public interface WishListService {
    WishListResponseDTO addToWishList(Long productId);
    List<WishListResponseDTO> getWishList();
    void deleteWishList(Long wishListId);
}
