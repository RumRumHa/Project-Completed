package com.ra.service.imp;

import com.ra.mapper.UserMapper;
import com.ra.model.dto.response.*;
import com.ra.model.entity.*;
import com.ra.repository.*;
import com.ra.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportServiceImp implements ReportService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private WishListRepository wishListRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    // Lấy top 10 sản phẩm bán chạy nhất
    @Override
    public List<BestSellerProductResponseDTO> getBestSellerProducts(Date from, Date to) {
        List<Order> orders = orderRepository.findByStatusAndCreatedAtBetween(EOrderStatus.SUCCESS, from, to);

        Map<Long, BestSellerProductResponseDTO> productMap = new HashMap<>();

        // Tính toán tổng số lượng bán của từng sản phẩm
        for (Order order : orders) {
            List<OrderDetail> orderDetails = orderDetailRepository.findByOrderId(order.getId());

            for (OrderDetail orderDetail : orderDetails) {
                Long productId = orderDetail.getProduct().getProductId();
                String productName = orderDetail.getProduct().getProductName();
                int quantity = orderDetail.getOrderQuantity();
                double unitPrice = orderDetail.getUnitPrice().doubleValue(); // Assuming getUnitPrice() returns BigDecimal
                double totalRevenue = unitPrice * quantity;

                BestSellerProductResponseDTO productDTO = productMap.get(productId);
                if (productDTO == null) {
                    productDTO = BestSellerProductResponseDTO.builder()
                            .productId(productId)
                            .productName(productName)
                            .totalQuantity(quantity)
                            .totalRevenue(totalRevenue)
                            .build();
                    productMap.put(productId, productDTO);
                } else {
                    productDTO.setTotalQuantity(productDTO.getTotalQuantity() + quantity);
                    productDTO.setTotalRevenue(productDTO.getTotalRevenue() + totalRevenue);
                }
            }
        }

        List<BestSellerProductResponseDTO> bestSellerProducts = new ArrayList<>(productMap.values());

        // Sắp xếp danh sách theo tổng số lượng bán giảm dần và lấy top 10 sản phẩm
        bestSellerProducts.sort(Comparator.comparing(BestSellerProductResponseDTO::getTotalQuantity).reversed());
        bestSellerProducts = bestSellerProducts.subList(0, Math.min(bestSellerProducts.size(), 10));

        return bestSellerProducts;
    }

    // Lấy top 10 sản phẩm được yêu thích nhất
    @Override
    public List<MostLikedProductResponseDTO> getMostLikedProducts(Date from, Date to) {
        // Lấy các lượt đánh giá trong khoảng thời gian từ 'from' đến 'to'
        List<WishList> wishLists = wishListRepository.findByCreatedAtBetween(from, to);

        // Tạo một map để lưu trữ tổng số lượt yêu thích của từng sản phẩm
        Map<Long, MostLikedProductResponseDTO> productMap = new HashMap<>();

        // Tính toán tổng số lượt yêu thích của từng sản phẩm
        for (WishList wishList : wishLists) {
            Long productId = wishList.getProduct().getProductId();
            String productName = wishList.getProduct().getProductName();

            MostLikedProductResponseDTO productDTO = productMap.get(productId);
            if (productDTO == null) {
                productDTO = MostLikedProductResponseDTO.builder()
                        .productId(productId)
                        .productName(productName)
                        .totalLikes(1)
                        .build();
                productMap.put(productId, productDTO);
            } else {
                productDTO.setTotalLikes(productDTO.getTotalLikes() + 1);
            }
        }

        // Chuyển map thành danh sách DTO
        List<MostLikedProductResponseDTO> mostLikedProducts = new ArrayList<>(productMap.values());

        // Sắp xếp danh sách theo tổng số lượt yêu thích giảm dần và lấy top 10 sản phẩm
        mostLikedProducts.sort(Comparator.comparing(MostLikedProductResponseDTO::getTotalLikes).reversed());
        mostLikedProducts = mostLikedProducts.subList(0, Math.min(mostLikedProducts.size(), 10));

        return mostLikedProducts;
    }

    // Lấy doanh thu theo danh mục
    @Override
    public List<RevenueByCategoryResponseDTO> getRevenueByCategory(Date from, Date to) {
        List<Order> orders = orderRepository.findByStatusAndCreatedAtBetween(EOrderStatus.SUCCESS, from, to);
        return calculateRevenueByCategory(orders);
    }

    @Override
    public List<RevenueByCategoryResponseDTO> getRevenueByCategoryByYear(Integer year) {
        List<Order> orders = orderRepository.findByStatusAndCreatedAtYear(EOrderStatus.SUCCESS, year);
        return calculateRevenueByCategory(orders);
    }

    @Override
    public List<RevenueByCategoryResponseDTO> getRevenueByCategoryByMonth(Integer month) {
        List<Order> orders = orderRepository.findByStatusAndCreatedAtMonth(EOrderStatus.SUCCESS, month);
        return calculateRevenueByCategory(orders);
    }

    @Override
    public List<RevenueByCategoryResponseDTO> getRevenueByCategoryOverall() {
        List<Order> orders = orderRepository.findByStatus(EOrderStatus.SUCCESS);
        return calculateRevenueByCategory(orders);
    }

    // Lấy top khách hàng chi tiêu nhiều nhất
    @Override
    public List<TopSpendingCustomerResponseDTO> getTopSpendingCustomers(Date from, Date to) {
        List<Order> orders = orderRepository.findByStatusAndCreatedAtBetween(EOrderStatus.SUCCESS, from, to);

        // Tạo một map để lưu trữ tổng chi tiêu của từng khách hàng
        Map<Long, TopSpendingCustomerResponseDTO> customerMap = new HashMap<>();

        // Tính toán tổng chi tiêu của từng khách hàng
        for (Order order : orders) {
            User customer = order.getUser();
            Long customerId = customer.getUserId();
            String customerName = customer.getFullname();
            Double totalSpent = order.getTotalPrice().doubleValue();

            TopSpendingCustomerResponseDTO customerDTO = customerMap.get(customerId);
            if (customerDTO == null) {
                customerDTO = TopSpendingCustomerResponseDTO.builder()
                        .customerId(customerId)
                        .customerName(customerName)
                        .totalSpent(totalSpent)
                        .build();
                customerMap.put(customerId, customerDTO);
            } else {
                customerDTO.setTotalSpent(customerDTO.getTotalSpent() + totalSpent);
            }
        }

        List<TopSpendingCustomerResponseDTO> topSpendingCustomers = new ArrayList<>(customerMap.values());

        topSpendingCustomers.sort(Comparator.comparing(TopSpendingCustomerResponseDTO::getTotalSpent).reversed());
        topSpendingCustomers = topSpendingCustomers.subList(0, Math.min(topSpendingCustomers.size(), 10));

        return topSpendingCustomers;
    }

    //Danh sách khách hàng mới trong thang
    @Override
    public List<UserResponseDTO> getNewAccountsThisMonth(Integer month, Integer year) {
        // Lấy tháng và năm hiện tại nếu không có tham số được truyền vào
        YearMonth currentYearMonth = YearMonth.now();
        Integer targetYear = (year != null) ? year : currentYearMonth.getYear();
        Integer targetMonth = (month != null) ? month : currentYearMonth.getMonthValue();

        // Lấy danh sách người dùng được tạo trong tháng và năm cụ thể
        List<User> users = userRepository.findByMonthAndYear(targetMonth, targetYear);

        // Chuyển đổi danh sách User thành danh sách UserResponseDTO
        return users.stream()
                .map(UserMapper.INSTANCE::userToUserResponseDTO)
                .collect(Collectors.toList());
    }

    // Thống kê số lượng hóa đơn bán ra theo khoảng thời gian (from, to)
    @Override
    public List<InvoiceCountResponseDTO> getInvoicesOverTime(Date from, Date to) {
        Instant fromInstant = from.toInstant();
        Instant toInstant = to.toInstant();

        List<Order> orders = orderRepository.findByCreatedAtBetween(
                Date.from(fromInstant),
                Date.from(toInstant)
        );

        // Nhóm đơn hàng theo ngày và tính tổng số lượng đơn hàng và tổng doanh thu mỗi ngày
        return orders.stream()
                .collect(Collectors.groupingBy(
                        order -> {
                            Instant instant = new java.util.Date(order.getCreatedAt().getTime()).toInstant();
                            return instant.atZone(ZoneId.systemDefault()).toLocalDate();
                        },
                        Collectors.collectingAndThen(
                                Collectors.toList(),
                                orderList -> {
                                    long count = orderList.size();
                                    double total = orderList.stream()
                                            .mapToDouble(order -> order.getTotalPrice().doubleValue())
                                            .sum();
                                    return new AbstractMap.SimpleEntry<>(count, total);
                                }
                        )
                ))
                .entrySet()
                .stream()
                .map(entry -> InvoiceCountResponseDTO.builder()
                        .date(Date.from(entry.getKey().atStartOfDay(ZoneId.systemDefault()).toInstant()))
                        .invoiceCount(entry.getValue().getKey())
                        .total(entry.getValue().getValue())
                        .build())
                .collect(Collectors.toList());
    }

    private List<RevenueByCategoryResponseDTO> calculateRevenueByCategory(List<Order> orders) {
        Map<Long, RevenueByCategoryResponseDTO> categoryMap = new HashMap<>();

        for (Order order : orders) {
            List<OrderDetail> orderDetails = orderDetailRepository.findByOrderId(order.getId());

            for (OrderDetail orderDetail : orderDetails) {
                Category category = orderDetail.getProduct().getCategory();
                Long categoryId = category.getCategoryId();
                String categoryName = category.getCategoryName();
                double unitPrice = orderDetail.getUnitPrice().doubleValue();
                int quantity = orderDetail.getOrderQuantity();
                double totalRevenue = unitPrice * quantity;

                RevenueByCategoryResponseDTO categoryDTO = categoryMap.get(categoryId);
                if (categoryDTO == null) {
                    categoryDTO = RevenueByCategoryResponseDTO.builder()
                            .categoryId(categoryId)
                            .categoryName(categoryName)
                            .totalRevenue(totalRevenue)
                            .build();
                    categoryMap.put(categoryId, categoryDTO);
                } else {
                    categoryDTO.setTotalRevenue(categoryDTO.getTotalRevenue() + totalRevenue);
                }
            }
        }

        List<RevenueByCategoryResponseDTO> revenueByCategory = new ArrayList<>(categoryMap.values());
        revenueByCategory.sort(Comparator.comparing(RevenueByCategoryResponseDTO::getTotalRevenue).reversed());

        return revenueByCategory;
    }
}