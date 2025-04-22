package com.ra.service;

import com.ra.model.dto.response.PurchaseHistoryResponseDTO;
import com.ra.model.dto.response.ShoppingCartResponseDTO;
import com.ra.model.entity.EOrderStatus;

import java.util.List;

public interface CartService {
    List<ShoppingCartResponseDTO> getCartList();
    ShoppingCartResponseDTO addToCart(Long productId, Integer quantity);
    ShoppingCartResponseDTO updateCartItem(Long cartItemId, Integer quantity);
    void removeCartItem(Long cartItemId);
    void clearCart();
    void checkout();
    List<PurchaseHistoryResponseDTO> getPurchaseHistory();
    PurchaseHistoryResponseDTO getHistoryBySerialNumber(String serialNumber);
    List<PurchaseHistoryResponseDTO> getHistoryByStatus(EOrderStatus status);
    void cancelOrder(Long orderId);
}
