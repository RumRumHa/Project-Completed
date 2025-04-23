package com.ra.service.imp;

import com.ra.exception.CustomException;
import com.ra.mapper.WishListMapper;
import com.ra.model.dto.response.WishListResponseDTO;
import com.ra.model.entity.Product;
import com.ra.model.entity.User;
import com.ra.model.entity.WishList;
import com.ra.repository.ProductRepository;
import com.ra.repository.UserRepository;
import com.ra.repository.WishListRepository;
import com.ra.security.CustomUserDetails;
import com.ra.service.WishListService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class WishListServiceImp implements WishListService {
    @Autowired
    private WishListRepository wishListRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    // Phương thức kiểm tra xác thực và lấy thông tin người dùng
    private User getCurrentUser() throws CustomException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new CustomException("User is not authenticated");
        }
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userDetails.getUser();
    }
    @Override
    @Transactional
    public WishListResponseDTO addToWishList(Long productId) {
        User user = getCurrentUser();
        Long userId = user.getUserId();

        Optional<Product> productOptional = productRepository.findById(productId);
        if (productOptional.isEmpty()) {
            throw new CustomException("Product not found");
        }
        Product product = productOptional.get();
        if (wishListRepository.existsByUserUserIdAndProductProductId(userId, productId)) {
            throw new CustomException("Product already exists in wish list");
        }

        // Thêm sản phẩm vào danh sách yêu thích
        WishList wishList = new WishList();
        wishList.setUser(user);
        wishList.setProduct(product);
        wishList.setCreatedAt(new Date());

        //Lưu Wishlist vào DB
        WishList savedWishList = wishListRepository.save(wishList);

        return WishListMapper.INSTANCE.toResponseDTO(savedWishList);
    }

    // Phương thức lấy danh sách yêu thích
    @Override
    public List<WishListResponseDTO> getWishList() {
        User user = getCurrentUser();
        Long userId = user.getUserId();

        List<WishList> wishLists = wishListRepository.findByUserUserId(userId);
        return wishLists.stream()
                .map(WishListMapper.INSTANCE::toResponseDTO)
                .collect(Collectors.toList());
    }

    // Phương thức xóa yêu thích
    @Override
    public void deleteWishList(Long wishListId) {
        User user = getCurrentUser();
        Long userId = user.getUserId();
        if (!wishListRepository.existsByUserUserIdAndWishListId(userId, wishListId)) {
            throw new CustomException("Wish list not found");
        }
        wishListRepository.deleteById(wishListId);
    }
}
