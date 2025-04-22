package com.ra.service.imp;

import com.ra.exception.CustomException;
import com.ra.mapper.CartMapper;
import com.ra.mapper.OrderDetailMapper;
import com.ra.mapper.OrderMapper;
import com.ra.model.dto.response.AddressResponseDTO;
import com.ra.model.dto.response.OrderDetailResponseDTO;
import com.ra.model.dto.response.PurchaseHistoryResponseDTO;
import com.ra.model.dto.response.ShoppingCartResponseDTO;
import com.ra.model.entity.*;
import com.ra.repository.AddressRepository;
import com.ra.repository.CartRepository;
import com.ra.repository.OrderRepository;
import com.ra.repository.ProductRepository;
import com.ra.security.CustomUserDetails;
import com.ra.service.AddressService;
import com.ra.service.CartService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartServiceImp implements CartService {
    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private AddressService addressService;

    // Phương thức kiểm tra xác thực và lấy thông tin người dùng
    private User getCurrentUser() throws CustomException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new CustomException("User is not authenticated");
        }
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userDetails.getUser();
    }

    // Danh sách sản phẩm trong giỏ hàng
    @Override
    public List<ShoppingCartResponseDTO> getCartList() {
        try {
            User user = getCurrentUser();
            Long userId = user.getUserId();

            List<ShoppingCart> cartList = cartRepository.findByUserUserId(userId);
            return cartList.stream()
                    .map(CartMapper.INSTANCE::toResponseDTO)
                    .collect(Collectors.toList());
        } catch (CustomException ce) {
            throw ce;
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while retrieving the cart list");
        }
    }

    // Thêm sản phẩm vào giỏ hàng
    @Override
    public ShoppingCartResponseDTO addToCart(Long productId, Integer quantity) {
        try {
            User user = getCurrentUser();
            Long userId = user.getUserId();
            Optional<Product> productOptional = productRepository.findById(productId);
            if (productOptional.isEmpty()) {
                throw new CustomException("Product not found");
            }
            Product product = productOptional.get();
            if (product.getStockQuantity() < quantity) {
                throw new CustomException("Not enough stock available");
            }

            // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
            List<ShoppingCart> existingCartList = cartRepository.findByUserUserIdAndProductProductId(userId, productId);
            ShoppingCart cart;
            if (!existingCartList.isEmpty()) {
                cart = existingCartList.get(0);
                cart.setOrderQuantity(cart.getOrderQuantity() + quantity);
            } else {
                cart = new ShoppingCart();
                cart.setUser(user);
                cart.setProduct(product);
                cart.setOrderQuantity(quantity);
            }

            // Lưu giỏ hàng vào cơ sở dữ liệu
            ShoppingCart savedCart = cartRepository.save(cart);

            // Ánh xạ và trả về DTO
            return CartMapper.INSTANCE.toResponseDTO(savedCart);
        } catch (CustomException ce) {
            ce.printStackTrace();
            throw ce;
        } catch (Exception e) {
            e.printStackTrace();
            throw new CustomException("An unexpected error occurred while adding to cart");
        }
    }

    //Thay đổi số lượng đặt hàng của 1 sản phẩm  (payload :quantity)
    @Override
    public ShoppingCartResponseDTO updateCartItem(Long cartItemId, Integer quantity) {
        try {
            User user = getCurrentUser();
            Long userId = user.getUserId();

            Optional<ShoppingCart> cartItemOptional = cartRepository.findById(cartItemId);
            if (cartItemOptional.isEmpty()) {
                throw new CustomException("Cart item not found");
            }
            ShoppingCart cartItem = cartItemOptional.get();

            // Kiểm tra quyền sở hữu của mục giỏ hàng
            if (!cartItem.getUser().getUserId().equals(userId)) {
                throw new CustomException("You are not authorized to update this cart item");
            }

            Product product = cartItem.getProduct();
            if (product.getStockQuantity() < quantity) {
                throw new CustomException("Not enough stock available");
            }

            if (quantity <= 0) {
                throw new CustomException("Quantity must be greater than zero");
            }

            cartItem.setOrderQuantity(quantity);
            ShoppingCart updatedCartItem = cartRepository.save(cartItem);
            return CartMapper.INSTANCE.toResponseDTO(updatedCartItem);
        } catch (CustomException ce) {
            throw ce;
        } catch (Exception e) {
            e.printStackTrace();
            throw new CustomException("An unexpected error occurred while updating cart item");
        }
    }

    //Xóa 1 sản phẩm trong giỏ hàng
    @Override
    public void removeCartItem(Long cartItemId) {
        try {
            User user = getCurrentUser();
            Long userId = user.getUserId();
            Optional<ShoppingCart> cartItemOptional = cartRepository.findById(cartItemId);
            if (cartItemOptional.isEmpty()) {
                throw new CustomException("Cart item not found");
            }
            ShoppingCart cartItem = cartItemOptional.get();

            if (!cartItem.getUser().getUserId().equals(userId)) {
                throw new CustomException("You are not authorized to remove this cart item");
            }
            cartRepository.delete(cartItem);
        } catch (CustomException ce) {
            throw ce;
        } catch (Exception e) {
            e.printStackTrace();
            throw new CustomException("An unexpected error occurred while removing cart item");
        }
    }

    //Xóa toàn bộ sản phẩm trong giỏ hàng
    @Override
    @Transactional
    public void clearCart() {
        try {
            User user = getCurrentUser();
            Long userId = user.getUserId();
            cartRepository.deleteByUserUserId(userId);
        } catch (CustomException ce) {
            throw ce;
        } catch (Exception e) {
            e.printStackTrace();
            throw new CustomException("An unexpected error occurred while clearing cart");
        }
    }

    //Thanh toán
    @Override
    @Transactional
    public void checkout() {
        try {
            User user = getCurrentUser();
            Long userId = user.getUserId();
            List<ShoppingCart> cartItems = cartRepository.findByUserUserId(userId);
            if (cartItems.isEmpty()) {
                throw new CustomException("Your cart is empty");
            }

            // Tạo một Order mới
            Order order = new Order();
            order.setUser(user);
            order.setTotalPrice(BigDecimal.ZERO);
            order.setStatus(EOrderStatus.WAITING);
            order.setNote("Đã nhận đơn hàng");
            order.setCreatedAt(new Date());
            order.setOrderDetails(new HashSet<>());

            AddressResponseDTO defaultAddress = addressService.getDefaultAddress();
            order.setReceiveName(defaultAddress.getReceiveName());
            order.setReceiveAddress(defaultAddress.getFullAddress());
            order.setReceivePhone(defaultAddress.getPhone());

            BigDecimal totalPrice = BigDecimal.ZERO;

            // Tạo các OrderDetail từ các mục trong ShoppingCart
            for (ShoppingCart cartItem : cartItems) {
                Product product = cartItem.getProduct();
                if (product.getStockQuantity() < cartItem.getOrderQuantity()) {
                    throw new CustomException("Not enough stock available for product: " + product.getProductName());
                }
                product.setStockQuantity(product.getStockQuantity() - cartItem.getOrderQuantity());
                productRepository.save(product);

                OrderDetail orderDetail = new OrderDetail();
                orderDetail.setOrder(order);
                orderDetail.setProduct(product);
                orderDetail.setName(product.getProductName());
                orderDetail.setUnitPrice(product.getUnitPrice());
                orderDetail.setOrderQuantity(cartItem.getOrderQuantity());

                totalPrice = totalPrice.add(orderDetail.getUnitPrice().multiply(BigDecimal.valueOf(orderDetail.getOrderQuantity())));
                order.getOrderDetails().add(orderDetail);
            }

            order.setTotalPrice(totalPrice);

            // Lưu Order vào cơ sở dữ liệu
            orderRepository.save(order);

            // Xóa ShoppingCart của người dùng
            cartRepository.deleteByUserUserId(userId);
        } catch (CustomException ce) {
            throw ce;
        } catch (Exception e) {
            e.printStackTrace();
            throw new CustomException("An unexpected error occurred while checking out");
        }
    }

    //Lấy lịch sử mua hàng
    @Override
    public List<PurchaseHistoryResponseDTO> getPurchaseHistory() {
        try {
            User user = getCurrentUser();
            Long userId = user.getUserId();
            List<Order> orders = orderRepository.findByUserUserId(userId);
            return orders.stream()
                    .map(order -> PurchaseHistoryResponseDTO.builder()
                            .orderId(order.getId())
                            .serialNumber(order.getSerialNumber())
                            .orderDate(order.getCreatedAt().toString())
                            .orderStatus(order.getStatus().name())
                            .totalPrice(order.getTotalPrice().doubleValue())
                            .note(order.getNote())
                            .receiveName(order.getReceiveName())
                            .receiveAddress(order.getReceiveAddress())
                            .receivePhone(order.getReceivePhone())
                            .build())
                    .collect(Collectors.toList());
        } catch (CustomException ce) {
            throw ce;
        } catch (Exception e) {
            e.printStackTrace();
            throw new CustomException("An unexpected error occurred while retrieving purchase history");
        }
    }

    //Lấy chi tiết lịch sử mua hàng theo serialNumber
    @Override
    @Transactional
    public PurchaseHistoryResponseDTO getHistoryBySerialNumber(String serialNumber) {
        try {
            User user = getCurrentUser();
            Long userId = user.getUserId();
            Optional<Order> orderOptional = orderRepository.findBySerialNumberAndUserUserId(serialNumber, userId);
            if (orderOptional.isEmpty()) {
                throw new CustomException("Order with serial number " + serialNumber + " not found");
            }
            Order order = orderOptional.get();
            List<OrderDetailResponseDTO> orderDetails = order.getOrderDetails().stream()
                    .map(OrderDetailMapper.INSTANCE::orderDetailToOrderDetailResponseDTO)
                    .collect(Collectors.toList());
            return PurchaseHistoryResponseDTO.builder()
                    .orderId(order.getId())
                    .orderDate(order.getCreatedAt().toString())
                    .serialNumber(order.getSerialNumber())
                    .orderStatus(order.getStatus().name())
                    .totalPrice(order.getTotalPrice().doubleValue())
                    .note(order.getNote())
                    .receiveName(order.getReceiveName())
                    .receiveAddress(order.getReceiveAddress())
                    .receivePhone(order.getReceivePhone())
                    .orderDetails(orderDetails)
                    .build();
        } catch (CustomException ce) {
            throw ce;
        } catch (Exception e) {
            e.printStackTrace();
            throw new CustomException("An unexpected error occurred while retrieving purchase history");
        }
    }

    //Lấy lịch sử mua hàng theo trạng thái
    @Override
    @Transactional
    public List<PurchaseHistoryResponseDTO> getHistoryByStatus(EOrderStatus status) {
        try {
            User user = getCurrentUser();
            Long userId = user.getUserId();
            List<Order> orders = orderRepository.findByUserUserIdAndStatus(userId, status);
            return orders.stream()
                    .map(order -> PurchaseHistoryResponseDTO.builder()
                            .orderId(order.getId())
                            .serialNumber(order.getSerialNumber())
                            .orderDate(order.getCreatedAt().toString())
                            .orderStatus(order.getStatus().name())
                            .totalPrice(order.getTotalPrice().doubleValue())
                            .receiveName(order.getReceiveName())
                            .receiveAddress(order.getReceiveAddress())
                            .receivePhone(order.getReceivePhone())
                            .build())
                    .collect(Collectors.toList());
        } catch (CustomException ce) {
            throw ce;
        } catch (Exception e) {
            e.printStackTrace();
            throw new CustomException("An unexpected error occurred while retrieving purchase history");
        }
    }

    @Override
    @Transactional
    public void cancelOrder(Long orderId) {
        try {
            User user = getCurrentUser();
            Long userId = user.getUserId();
            Optional<Order> orderOptional = orderRepository.findById(orderId);
            if (orderOptional.isEmpty()) {
                throw new CustomException("Order not found");
            }
            Order order = orderOptional.get();

            // Kiểm tra quyền sở hữu của đơn hàng
            if (!order.getUser().getUserId().equals(userId)) {
                throw new CustomException("You are not authorized to cancel this order");
            }

            // Kiểm tra trạng thái đơn hàng
            if (!order.getStatus().equals(EOrderStatus.WAITING)) {
                throw new CustomException("Order cannot be canceled as it is not in the WAITING status");
            }

            // Hủy đơn hàng
            order.setStatus(EOrderStatus.CANCEL);
            order.setNote("Đơn hàng đã bị hủy");
            orderRepository.save(order);

            // Trả lại số lượng sản phẩm vào kho
            for (OrderDetail orderDetail : order.getOrderDetails()) {
                Product product = orderDetail.getProduct();
                product.setStockQuantity(product.getStockQuantity() + orderDetail.getOrderQuantity());
                productRepository.save(product);
            }
        } catch (CustomException ce) {
            throw ce;
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while cancelling order");
        }
    }
}
