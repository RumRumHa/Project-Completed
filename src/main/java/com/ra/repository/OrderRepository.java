package com.ra.repository;

import com.ra.model.entity.EOrderStatus;
import com.ra.model.entity.Order;
import com.ra.model.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findByStatus(EOrderStatus status, Pageable pageable);
    @EntityGraph(attributePaths = {"orderDetails"})
    Page<Order> findById(Long orderId, Pageable pageable);
    List<Order> findByStatusAndCreatedAtBetween(EOrderStatus status, Date from, Date to);
    @Query("SELECT o FROM Order o WHERE o.status = :status AND YEAR(o.createdAt) = :year")
    List<Order> findByStatusAndCreatedAtYear(@Param("status") EOrderStatus status, @Param("year") Integer year);

    @Query("SELECT o FROM Order o WHERE o.status = :status AND MONTH(o.createdAt) = :month")
    List<Order> findByStatusAndCreatedAtMonth(@Param("status") EOrderStatus status, @Param("month") Integer month);

    List<Order> findByStatus(EOrderStatus status);
    List<Order> findByCreatedAtBetween(Date from, Date to);
    List<Order> findByUserUserId(Long userId);
    Optional<Order> findBySerialNumberAndUserUserId(String serialNumber, Long userId);
    List<Order> findByUserUserIdAndStatus(Long userId, EOrderStatus status);

    @Query(value = "SELECT * FROM orders " +
            "WHERE (LOWER(remove_accents(serial_number)) LIKE LOWER(CONCAT('%', remove_accents(:keyword), '%')) " +
            "OR LOWER(remove_accents(receive_name)) LIKE LOWER(CONCAT('%', remove_accents(:keyword), '%')))",
            countQuery = "SELECT COUNT(*) FROM orders " +
                    "WHERE (LOWER(remove_accents(product_name)) LIKE LOWER(CONCAT('%', remove_accents(:keyword), '%')) " +
                    "OR LOWER(remove_accents(receive_name)) LIKE LOWER(CONCAT('%', remove_accents(:keyword), '%')))",
            nativeQuery = true)
    Page<Order> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
}
