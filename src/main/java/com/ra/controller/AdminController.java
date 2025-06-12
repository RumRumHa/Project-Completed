package com.ra.controller;

import com.ra.exception.CustomException;
import com.ra.model.dto.request.CategoryRequestDTO;
import com.ra.model.dto.request.ProductRequestDTO;
import com.ra.model.dto.request.SignupRequestDTO;
import com.ra.model.dto.request.UserRequestDTO;
import com.ra.model.dto.response.*;
import com.ra.service.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("api/v1/admin")
public class AdminController {
    @Autowired
    private UserService userService;

    @Autowired
    private RoleService roleService;

    @Autowired
    private ProductService productService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private ReportService reportService;

    @Autowired
    private AuthService authService;

    private <T> ResponseEntity<T> wrapOrNotFound(T body) {
        return body != null ? ResponseEntity.ok(body) : ResponseEntity.notFound().build();
    }

    private ResponseEntity<Void> wrapDelete(boolean deleted) {
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    private Pageable getPageable(int page, int limit, String sortBy, String orderBy) {
        Sort.Direction direction = "asc".equalsIgnoreCase(orderBy)
                ? Sort.Direction.ASC : Sort.Direction.DESC;
        Sort sort = Sort.by(direction, sortBy);
        return PageRequest.of(page, limit, sort);
    }

    //Lấy ra danh sách người dùng (phân trang và sắp xếp)
    @GetMapping("/users")
    public ResponseEntity<Page<UserResponseDTO>> getUsers(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "limit", defaultValue = "10") int limit,
            @RequestParam(name = "sortBy", defaultValue = "username") String sortBy,
            @RequestParam(name = "orderBy", defaultValue = "asc") String orderBy
    ) {
        Pageable pageable = getPageable(page, limit, sortBy, orderBy);
        return ResponseEntity.ok(userService.getUsers(pageable));
    }

    //Them user
    @PostMapping("/users")
    public ResponseEntity<MessageResponse> addUser(
            @RequestParam("username") @NotBlank String username,
            @RequestParam("email") @NotBlank @Email String email,
            @RequestParam("password") @NotBlank String password,
            @RequestParam("fullname") @NotBlank String fullname,
            @RequestParam("phone") @NotBlank String phone,
            @RequestParam("address") @NotBlank String address,
            @RequestParam("avatar") MultipartFile avatar
    ) {
        SignupRequestDTO signupRequestDTO = SignupRequestDTO.builder()
                .username(username)
                .email(email)
                .password(password)
                .fullname(fullname)
                .phone(phone)
                .address(address)
                .avatar(avatar)
                .build();
        authService.register(signupRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new MessageResponse("User created successfully!"));
    }

    //Chinh sua user
    @PutMapping("/users/{userId}")
    public ResponseEntity<UserResponseDTO> updateUser(
            @PathVariable Long userId,
            @ModelAttribute UserRequestDTO userRequestDTO,
            @RequestParam (value = "avatar", required = false) MultipartFile avatar
    ) {
        userRequestDTO.setUserId(userId);
        userRequestDTO.setAvatar(avatar);
        UserResponseDTO updatedUserResponseDTO = userService.updateUser(userRequestDTO);
        return ResponseEntity.ok(updatedUserResponseDTO);
    }

    //Xoa user
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        boolean deleted = userService.deleteUser(userId);
        return wrapDelete(deleted);
    }

    //Lay user theo userId
    @GetMapping("/users/{userId}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long userId) {
        UserResponseDTO userResponseDTO = userService.getUserById(userId);
        return wrapOrNotFound(userResponseDTO);
    }

    //Thêm quyền cho người dùng
    @PostMapping("/users/{userId}/role/{roleId}")
    public ResponseEntity<UserResponseDTO> addRoleToUser(@PathVariable Long userId, @PathVariable Long roleId) {
        UserResponseDTO responseDto = userService.addRoleToUser(userId, roleId);
        return ResponseEntity.ok(responseDto);
    }

    //Xóa quyền của người dùng
    @DeleteMapping("/users/{userId}/role/{roleId}")
    public ResponseEntity<UserResponseDTO> removeRoleFromUser(@PathVariable Long userId, @PathVariable Long roleId) {
        UserResponseDTO responseDto = userService.removeRoleFromUser(userId, roleId);
        return ResponseEntity.ok(responseDto);
    }

    //Khóa / Mở khóa người dùng
    @PutMapping("/users/status/{userId}")
    public ResponseEntity<UserResponseDTO> updateUserStatus(@PathVariable Long userId) {
        UserResponseDTO responseDto = userService.updateUserStatus(userId);
        return ResponseEntity.ok(responseDto);
    }

    //Lấy về danh sách quyền
    @GetMapping("/roles")
    public ResponseEntity<List<RoleResponseDTO>> getRoles() {
        List<RoleResponseDTO> roles = roleService.getRoles();
        return ResponseEntity.ok(roles);
    }

    //Tìm kiếm người dùng theo tên
    @GetMapping("/users/search")
    public ResponseEntity<Page<UserResponseDTO>> searchUsers(
            @RequestParam String keyword,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "limit", defaultValue = "10") int limit
    ) {
        Pageable pageable = PageRequest.of(page, limit);
        return ResponseEntity.ok(userService.searchUsers(keyword, pageable));
    }

    //Lấy về danh sách tất cả sản phẩm (sắp xếp và phân trang)
    @GetMapping("/products")
    public ResponseEntity<Page<ProductResponseDTO>> getProducts(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "limit", defaultValue = "10") int limit,
            @RequestParam(name = "sortBy", defaultValue = "productName") String sortBy,
            @RequestParam(name = "orderBy", defaultValue = "asc") String orderBy
    ) {
       Pageable pageable = getPageable(page, limit, sortBy, orderBy);
       return ResponseEntity.ok(productService.getProducts(pageable));
    }

    //Lấy về thông tin sản phẩm theo id
    @GetMapping("/products/{productId}")
    public ResponseEntity<ProductResponseDTO> getProductById(@PathVariable Long productId) {
        ProductResponseDTO responseDto = productService.getProductById(productId);
        return wrapOrNotFound(responseDto);
    }

    //Thêm mới sản phẩm
    @PostMapping("/products")
    public ResponseEntity<ProductResponseDTO> addProduct(
            @ModelAttribute ProductRequestDTO productRequestDTO,
            @RequestPart(value = "mainImageUrl", required = false) MultipartFile mainImageUrl,
            @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) {
        if (mainImageUrl != null) {
            productRequestDTO.setMainImageUrl(mainImageUrl);
        }
        if (images != null && !images.isEmpty()) {
            productRequestDTO.setImages(images);
        }
        ProductResponseDTO responseDto = productService.addProduct(productRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    // Chỉnh sửa thông tin sản phẩm
    @PutMapping("/products/{productId}")
    public ResponseEntity<ProductResponseDTO> updateProduct(
            @PathVariable Long productId,
            @ModelAttribute ProductRequestDTO productRequestDTO,
            @RequestPart(value = "image", required = false) List<MultipartFile> image
    ) {
        if (image != null && !image.isEmpty()) {
            productRequestDTO.setImages(image);
        }
        ProductResponseDTO responseDto = productService.updateProduct(productId, productRequestDTO);
        return wrapOrNotFound(responseDto);
    }

    //Xóa sản phẩm
    @DeleteMapping("/products/{productId}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long productId) {
        boolean deleted = productService.deleteProduct(productId);
        return wrapDelete(deleted);
    }

    @GetMapping("products/search")
    public ResponseEntity<Page<ProductResponseDTO>> searchProduct(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit) {

        Pageable pageable = PageRequest.of(page, limit);
        Page<ProductResponseDTO> result = productService.searchByKeyword(keyword, pageable);
        return ResponseEntity.ok(result);
    }

    //Lấy về danh sách tất cả danh mục (sắp xếp và phân trang)
    @GetMapping("/categories")
    public ResponseEntity<Page<CategoryResponseDTO>> getCategories(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "limit", defaultValue = "10") int limit,
            @RequestParam(name = "sortBy", defaultValue = "categoryName") String sortBy,
            @RequestParam(name = "orderBy", defaultValue = "asc") String orderBy
    ) {
        Pageable pageable = getPageable(page, limit, sortBy, orderBy);
        return ResponseEntity.ok(categoryService.getCategories(pageable));
    }

    //Lấy về thông tin danh mục theo id
    @GetMapping("/categories/{categoryId}")
    public ResponseEntity<CategoryResponseDTO> getCategoryById(@PathVariable Long categoryId) {
        CategoryResponseDTO responseDto = categoryService.getCategoryById(categoryId);
        return wrapOrNotFound(responseDto);
    }

    //Thêm mới danh mục
    @PostMapping("/categories")
    public ResponseEntity<CategoryResponseDTO> addCategory(
            @ModelAttribute CategoryRequestDTO categoryRequestDTO,
            @RequestPart(value = "avatar", required = false) MultipartFile avatar
    ) {
        if (avatar != null) {
            categoryRequestDTO.setAvatar(avatar);
        }
        CategoryResponseDTO responseDto = categoryService.addCategory(categoryRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    //Chỉnh sửa thông tin danh mục
    @PutMapping("/categories/{categoryId}")
    public ResponseEntity<CategoryResponseDTO> updateCategory(
            @PathVariable Long categoryId,
            @ModelAttribute CategoryRequestDTO categoryRequestDTO,
            @RequestPart(value = "avatar", required = false) MultipartFile avatar
    ) {
        if (avatar != null && !avatar.isEmpty()) {
            categoryRequestDTO.setAvatar(avatar);
        }
        CategoryResponseDTO responseDto = categoryService.updateCategory(categoryId, categoryRequestDTO);
        return wrapOrNotFound(responseDto);
    }

    //Xóa danh mục
    @DeleteMapping("/categories/{categoryId}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long categoryId) {
        categoryService.deleteCategory(categoryId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("categories/search")
    public ResponseEntity<Page<CategoryResponseDTO>> search(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit) {

        Pageable pageable = PageRequest.of(page, limit);
        Page<CategoryResponseDTO> result = categoryService.searchByKeyword(keyword, pageable);
        return ResponseEntity.ok(result);
    }

    //Danh sách tất cả đơn hàng
    @GetMapping("/orders")
    public ResponseEntity<Page<OrderResponseDTO>> getOrders(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "limit", defaultValue = "10") int limit,
            @RequestParam(name = "sortBy", defaultValue = "createdAt") String sortBy,
            @RequestParam(name = "orderBy", defaultValue = "desc") String orderBy
    ) {
        Pageable pageable = getPageable(page, limit, sortBy, orderBy);
        return ResponseEntity.ok(orderService.getOrders(pageable));
    }

    //Danh sách đơn hàng theo trạng thái
    @GetMapping("/orders/{status}")
    public ResponseEntity<Page<OrderResponseDTO>> getOrdersByStatus(
            @PathVariable String status,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "limit", defaultValue = "10") int limit,
            @RequestParam(name = "sortBy", defaultValue = "createdAt") String sortBy,
            @RequestParam(name = "orderBy", defaultValue = "desc") String orderBy
    ) {
        Pageable pageable = getPageable(page, limit, sortBy, orderBy);
        return ResponseEntity.ok(orderService.getOrderByStatus(status, pageable));
    }

    // Chi tiết đơn hàng
    @GetMapping("/orders/orderDetail/{orderId}")
    public ResponseEntity<OrderResponseDTO> getOrderById(@PathVariable Long orderId) {
        OrderResponseDTO responseDto = orderService.getOrderById(orderId);
        if (responseDto == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        List<OrderDetailResponseDTO> orderDetails = orderService.getOrderDetailsByOrderId(orderId);
        responseDto.setOrderDetails(orderDetails);
        return ResponseEntity.ok(responseDto);
    }

    //Cập nhật trạng thái đơn hàng (payload : orderStatus)
    @PutMapping("/orders/{orderId}/status/{status}")
    public ResponseEntity<OrderResponseDTO> updateOrderStatus(
            @PathVariable Long orderId,
            @PathVariable String status
    ) {
        OrderResponseDTO responseDTO = orderService.updateOrderStatus(orderId, status);
        if (responseDTO == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(responseDTO);
    }

    //Xoa order
    @DeleteMapping("orders/{orderId}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long orderId) {
        orderService.deleteOrder(orderId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("orders/search")
    public ResponseEntity<Page<OrderResponseDTO>> searchOrders(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit) {

        Pageable pageable = PageRequest.of(page, limit);
        Page<OrderResponseDTO> result = orderService.searchByKeyword(keyword, pageable);
        return ResponseEntity.ok(result);
    }

    //Doanh thu bán hàng theo thời gian (payload : from , to)
    @GetMapping("/reports/sales-revenue-over-time")
    public ResponseEntity<List<SalesRevenueOverTimeResponseDTO>> getSalesRevenueOverTime(
            @RequestParam(name = "from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date from,
            @RequestParam(name = "to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date to) {

        if (from == null || to == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        List<SalesRevenueOverTimeResponseDTO> revenueData = orderService.getSalesRevenueOverTime(from, to);

        if (revenueData == null || revenueData.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.ok(revenueData);
    }

    //Danh sách 10 sản phẩm bán chạy theo thời gian (from, to)
    @GetMapping("/reports/best-seller-products")
    public ResponseEntity<List<BestSellerProductResponseDTO>> getBestSellerProducts(
            @RequestParam(name = "from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date from,
            @RequestParam(name = "to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date to) {

        if (from == null || to == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        List<BestSellerProductResponseDTO> bestSellerProducts = reportService.getBestSellerProducts(from, to);

        if (bestSellerProducts == null || bestSellerProducts.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.ok(bestSellerProducts);
    }

    //Danh sách 10 sản phẩm yêu thích nhất theo thời gian (from, to)
    @GetMapping("/reports/most-liked-products")
    public ResponseEntity<List<MostLikedProductResponseDTO>> getMostLikedProducts(
            @RequestParam(name = "from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date from,
            @RequestParam(name = "to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date to) {

        if (from == null || to == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        List<MostLikedProductResponseDTO> mostLikedProducts = reportService.getMostLikedProducts(from, to);

        if (mostLikedProducts == null || mostLikedProducts.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.ok(mostLikedProducts);
    }

    //Thống kê doanh thu theo từng danh mục
    @GetMapping("/reports/revenue-by-category")
    public ResponseEntity<List<RevenueByCategoryResponseDTO>> getRevenueByCategory(
            @RequestParam(name = "from", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date from,
            @RequestParam(name = "to", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date to,
            @RequestParam(name = "year", required = false) Integer year,
            @RequestParam(name = "month", required = false) Integer month) {

        if (from != null && to != null) {
            return getRevenueByCategoryByDateRange(from, to);
        } else if (year != null) {
            return getRevenueByCategoryByYear(year);
        } else if (month != null) {
            return getRevenueByCategoryByMonth(month);
        } else {
            return getRevenueByCategoryOverall();
        }
    }

    private ResponseEntity<List<RevenueByCategoryResponseDTO>> getRevenueByCategoryByDateRange(Date from, Date to) {
        List<RevenueByCategoryResponseDTO> revenueByCategory = reportService.getRevenueByCategory(from, to);
        if (revenueByCategory == null || revenueByCategory.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.ok(revenueByCategory);
    }

    private ResponseEntity<List<RevenueByCategoryResponseDTO>> getRevenueByCategoryByYear(Integer year) {
        List<RevenueByCategoryResponseDTO> revenueByCategory = reportService.getRevenueByCategoryByYear(year);
        if (revenueByCategory == null || revenueByCategory.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.ok(revenueByCategory);
    }

    private ResponseEntity<List<RevenueByCategoryResponseDTO>> getRevenueByCategoryByMonth(Integer month) {
        List<RevenueByCategoryResponseDTO> revenueByCategory = reportService.getRevenueByCategoryByMonth(month);
        if (revenueByCategory == null || revenueByCategory.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.ok(revenueByCategory);
    }

    private ResponseEntity<List<RevenueByCategoryResponseDTO>> getRevenueByCategoryOverall() {
        List<RevenueByCategoryResponseDTO> revenueByCategory = reportService.getRevenueByCategoryOverall();
        if (revenueByCategory == null || revenueByCategory.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.ok(revenueByCategory);
    }

    //Thống kê top 10 khách hàng chi tiêu nhiều nhất theo thời gian (from , to)
    @GetMapping("/reports/top-spending-customers")
    public ResponseEntity<List<TopSpendingCustomerResponseDTO>> getTopSpendingCustomers(
            @RequestParam(name = "from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date from,
            @RequestParam(name = "to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date to) {

        if (from == null || to == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        List<TopSpendingCustomerResponseDTO> topSpendingCustomers = reportService.getTopSpendingCustomers(from, to);

        if (topSpendingCustomers == null || topSpendingCustomers.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.ok(topSpendingCustomers);
    }

    //danh sách tài khoản được tạo mới trong tháng
    @GetMapping("/reports/new-accounts-this-month")
    public ResponseEntity<List<UserResponseDTO>> getNewAccountsThisMonth(
            @RequestParam(name = "month", required = false) Integer month,
            @RequestParam(name = "year", required = false) Integer year
    ) {
        List<UserResponseDTO> newAccounts = reportService.getNewAccountsThisMonth(month, year);
        if (newAccounts == null || newAccounts.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.ok(newAccounts);
    }

    // Thống kê số lượng hóa đơn bán ra theo khoảng thời gian (from, to)
    @GetMapping("/reports/invoices-over-time")
    public ResponseEntity<List<InvoiceCountResponseDTO>> getInvoicesOverTime(
            @RequestParam(name = "from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date from,
            @RequestParam(name = "to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date to) {

        if (from == null || to == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        List<InvoiceCountResponseDTO> invoiceCounts = reportService.getInvoicesOverTime(from, to);
        if (invoiceCounts == null || invoiceCounts.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.ok(invoiceCounts);
    }
}
