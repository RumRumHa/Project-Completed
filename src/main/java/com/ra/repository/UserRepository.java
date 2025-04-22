package com.ra.repository;

import com.ra.model.entity.Product;
import com.ra.model.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
    User findByEmail(String email);
    Optional<User> findByUsernameAndPassword(String username, String password);
    Page<User> findAll(Pageable pageable);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    Page<User> findByUsernameContainingIgnoreCase(String username, Pageable pageable);
    @Query("SELECT u FROM User u WHERE YEAR(u.createdAt) = :year AND MONTH(u.createdAt) = :month")
    List<User> findByCreatedAtYearAndMonth(@Param("year") Integer year, @Param("month") Integer month);
    Page<User> findByIsDeletedFalse(Pageable pageable);
    @Query(value = "SELECT * FROM users " +
            "WHERE (LOWER(remove_accents(username)) LIKE LOWER(CONCAT('%', remove_accents(:keyword), '%')) " +
            "OR LOWER(remove_accents(fullname)) LIKE LOWER(CONCAT('%', remove_accents(:keyword), '%')))",
            countQuery = "SELECT COUNT(*) FROM users " +
                    "WHERE (LOWER(remove_accents(username)) LIKE LOWER(CONCAT('%', remove_accents(:keyword), '%')) " +
                    "OR LOWER(remove_accents(fullname)) LIKE LOWER(CONCAT('%', remove_accents(:keyword), '%')))",
            nativeQuery = true)
    Page<User> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
}
