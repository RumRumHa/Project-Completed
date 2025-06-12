package com.ra.repository;

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
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByPhone(String phone);

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);

    Page<User> findByUsernameContainingIgnoreCase(String username, Pageable pageable);

    @Query("SELECT u FROM User u WHERE YEAR(u.createdAt) = :year AND MONTH(u.createdAt) = :month")
    List<User> findByMonthAndYear(@Param("month") Integer month, @Param("year") Integer year);
    // Restore methods needed by UserServiceImp
    Page<User> findByIsDeletedFalse(Pageable pageable);

    @Query(value = "SELECT * FROM users " +
            "WHERE (LOWER(remove_accents(username)) LIKE LOWER(CONCAT('%', remove_accents(:keyword), '%')) " +
            "OR LOWER(remove_accents(fullname)) LIKE LOWER(CONCAT('%', remove_accents(:keyword), '%')))" +
            "AND is_deleted = false",
            countQuery = "SELECT COUNT(*) FROM users " +
                    "WHERE (LOWER(remove_accents(username)) LIKE LOWER(CONCAT('%', remove_accents(:keyword), '%')) " +
                    "OR LOWER(remove_accents(fullname)) LIKE LOWER(CONCAT('%', remove_accents(:keyword), '%')))" +
                    "AND is_deleted = false",
            nativeQuery = true)
    Page<User> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
}
