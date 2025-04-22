package com.ra.repository;

import com.ra.model.dto.response.AddressResponseDTO;
import com.ra.model.entity.Address;
import com.ra.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    List<AddressResponseDTO> findByUserUserId(Long userId);
    Address findByAddressId(Long addressId);
    List<Address> findByUser(User user);
    Optional<Address> findByUserUserIdAndIsDefault(Long userId, Boolean isDefault);
}
