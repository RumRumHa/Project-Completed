package com.ra.controller;

import com.ra.exception.CustomCheckoutException;
import com.ra.exception.CustomException;
import com.ra.model.dto.request.AddressRequestDTO;
import com.ra.model.dto.request.ChangePasswordRequestDTO;
import com.ra.model.dto.request.UpdateCartItemRequest;
import com.ra.model.dto.request.UserRequestDTO;
import com.ra.model.dto.response.*;
import com.ra.model.entity.EOrderStatus;
import com.ra.service.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;

@RestController
@RequestMapping("api/v1/user")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private CartService cartService;

    @Autowired
    private AddressService addressService;

    @Autowired
    private WishListService wishListService;

    @Autowired
    private CloudinaryService cloudinaryService;
    //Danh sách sản phẩm trong giỏ hàng
    @GetMapping("/cart/list")
    public ResponseEntity<List<ShoppingCartResponseDTO>> getCartList() {
        List<ShoppingCartResponseDTO> responseList = cartService.getCartList();
        return ResponseEntity.ok(responseList);
    }

    //Thêm mới sản phẩm vào giỏ hàng (payload: productId and quantity)
    @PostMapping("/cart/add")
    public ResponseEntity<ShoppingCartResponseDTO> addToCart(@RequestParam Long productId, @RequestParam Integer quantity) {
        System.out.println("ProductId: " + productId + ", Quantity: " + quantity); // Log the input parameters
        ShoppingCartResponseDTO responseDTO = cartService.addToCart(productId, quantity);
        return ResponseEntity.ok(responseDTO);
    }

    //Thay đổi số lượng đặt hàng của 1 sản phẩm  (payload :quantity)
    @PutMapping("/cart/items/{cartItemId}")
    public ResponseEntity<ShoppingCartResponseDTO> updateCartItem(@PathVariable Long cartItemId, @Valid @RequestBody UpdateCartItemRequest request) {
        Integer quantity = request.getQuantity();
        ShoppingCartResponseDTO responseDTO = cartService.updateCartItem(cartItemId, quantity);
        return ResponseEntity.ok(responseDTO);
    }

    //Xóa 1 sản phẩm trong giỏ hàng
    @DeleteMapping("/cart/items/{cartItemId}")
    public ResponseEntity<Void> removeCartItem(@PathVariable Long cartItemId) {
        cartService.removeCartItem(cartItemId);
        return ResponseEntity.noContent().build();
    }

    //Xóa toàn bộ sản phẩm trong giỏ hàng
    @DeleteMapping("/cart/clear")
    public ResponseEntity<Void> clearCart() {
        cartService.clearCart();
        return ResponseEntity.noContent().build();
    }

    //Đặt hàng
    @PostMapping("/cart/checkout")
    public ResponseEntity<Void> checkout() {
        cartService.checkout();
        return ResponseEntity.ok().build();
    }

    //Thông tin tài khoản người dùng
    @GetMapping("/account")
    public ResponseEntity<UserResponseDTO> getAccountInfo() {
        UserResponseDTO userResponseDTO = userService.getUserAccountInfo();
        return ResponseEntity.ok(userResponseDTO);
    }

    //Cập nhật thông tin người dùng
    @PutMapping("/account")
    public ResponseEntity<UserResponseDTO> updateAccountInfo(
            @Valid @ModelAttribute UserRequestDTO userRequestDTO,
            @RequestParam (value = "avatar", required = false) MultipartFile avatar
    ) {
        userRequestDTO.setAvatar(avatar);
        UserResponseDTO updatedUserResponseDTO = userService.updateUserAccountInfo(userRequestDTO);
        return ResponseEntity.ok(updatedUserResponseDTO);
    }

    //Thay đổi mật khẩu (payload : oldPass, newPass, confirmNewPass)
    @PutMapping("/account/change-password")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody ChangePasswordRequestDTO request) {
        userService.changePassword(request);
        return ResponseEntity.ok().build();
    }

    //thêm mới địa chỉ
    @PostMapping("/account/addresses")
    public ResponseEntity<AddressResponseDTO> addAddress(@Valid @RequestBody AddressRequestDTO addressRequestDTO) {
        AddressResponseDTO addressResponseDTO = addressService.addAddress(addressRequestDTO);
        return ResponseEntity.ok(addressResponseDTO);
    }

    //set address as default
    @PutMapping("/addresses/{addressId}/default")
    public ResponseEntity<Void> setDefaultAddress(@PathVariable Long addressId) {
        addressService.setDefaultAddress(addressId);
        return ResponseEntity.ok().build();
    }

    //Cập nhat địa chỉ
    @PutMapping("/account/addresses/{addressId}")
    public ResponseEntity<AddressResponseDTO> updateAddress(@PathVariable Long addressId, @Valid @RequestBody AddressRequestDTO addressRequestDTO) {
        AddressResponseDTO addressResponseDTO = addressService.updateAddress(addressId, addressRequestDTO);
        return ResponseEntity.ok(addressResponseDTO);
    }

    //Xóa 1 địa chỉ theo mã địa chỉ
    @DeleteMapping("/account/addresses/{addressId}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long addressId) {
        addressService.deleteAddress(addressId);
        return ResponseEntity.noContent().build();
    }

    //lấy ra danh sách địa chỉ của người dùng
    @GetMapping("/account/addresses")
    public ResponseEntity<List<AddressResponseDTO>> getAddresses() {
        List<AddressResponseDTO> addressResponseDTOList = addressService.getAddresses();
        return ResponseEntity.ok(addressResponseDTOList);
    }

    //lấy địa chỉ người dùng theo addressId
    @GetMapping("/account/addresses/{addressId}")
    public ResponseEntity<AddressResponseDTO> getAddressById(@PathVariable Long addressId) {
        AddressResponseDTO addressResponseDTO = addressService.getAddressById(addressId);
        return ResponseEntity.ok(addressResponseDTO);
    }

    //lấy ra danh sách lịch sử mua hàng
    @GetMapping("/history")
    public ResponseEntity<List<PurchaseHistoryResponseDTO>> getHistory() {
        List<PurchaseHistoryResponseDTO> purchaseHistory = cartService.getPurchaseHistory();
        return ResponseEntity.ok(purchaseHistory);
    }

    //lấy ra chi tiết đơn hàng theo số serial
    @GetMapping("/history/{serialNumber}")
    public ResponseEntity<PurchaseHistoryResponseDTO> getHistoryBySerialNumber(@PathVariable String serialNumber) {
        PurchaseHistoryResponseDTO purchaseHistory = cartService.getHistoryBySerialNumber(serialNumber);
        return ResponseEntity.ok(purchaseHistory);
    }

    //lấy ra danh sách lịch sử đơn hàng theo trạng thái đơn hàng
    @GetMapping("/history/status/{status}")
    public ResponseEntity<List<PurchaseHistoryResponseDTO>> getHistoryByStatus(@PathVariable String status) {
        EOrderStatus orderStatus = EOrderStatus.valueOf(status.toUpperCase());
        List<PurchaseHistoryResponseDTO> purchaseHistory = cartService.getHistoryByStatus(orderStatus);
        return ResponseEntity.ok(purchaseHistory);
    }

    //Hủy đơn hàng đang trong trạng thái chờ xác nhận
    @PutMapping("history/{orderId}/cancel")
    public ResponseEntity<Void> cancelOrder(@PathVariable Long orderId) {
        cartService.cancelOrder(orderId);
        return ResponseEntity.ok().build();
    }

    //Thêm mới 1 sản phẩm vào danh sách yêu thích (payload  : productId )
    @PostMapping("/wish-list")
    public ResponseEntity<WishListResponseDTO> addToWishlist(@RequestParam Long productId) {
        WishListResponseDTO wishlistResponseDTO = wishListService.addToWishList(productId);
        return ResponseEntity.ok(wishlistResponseDTO);
    }

    //Lấy ra danh sách yêu thích
    @GetMapping("/wish-list")
    public ResponseEntity<List<WishListResponseDTO>> getWishList() {
        List<WishListResponseDTO> wishlistResponseDTOList = wishListService.getWishList();
        return ResponseEntity.ok(wishlistResponseDTOList);
    }

    //Xóa sản phẩm ra khỏi danh sách yêu thích
    @DeleteMapping("/wish-list/{wishListId}")
    public ResponseEntity<Void> deleteWishList(@PathVariable Long wishListId) {
        wishListService.deleteWishList(wishListId);
        return ResponseEntity.noContent().build();
    }
}
