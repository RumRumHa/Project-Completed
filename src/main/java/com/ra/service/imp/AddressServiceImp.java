package com.ra.service.imp;

import com.ra.exception.CustomException;
import com.ra.mapper.AddressMapper;
import com.ra.model.dto.request.AddressRequestDTO;
import com.ra.model.dto.response.AddressResponseDTO;
import com.ra.model.entity.Address;
import com.ra.model.entity.User;
import com.ra.repository.AddressRepository;
import com.ra.security.CustomUserDetails;
import com.ra.service.AddressService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AddressServiceImp implements AddressService {
    @Autowired
    private AddressRepository addressRepository;

    // Phương thức kiểm tra xác thực và lấy thông tin người dùng
    private User getCurrentUser() throws CustomException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new CustomException("User is not authenticated");
        }
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userDetails.getUser();
    }

    //thêm địa chỉ mới
    @Override
    public AddressResponseDTO addAddress(AddressRequestDTO addressRequestDTO) throws CustomException {
        try {
            User user = getCurrentUser();

            if (addressRequestDTO.getFullAddress() == null || addressRequestDTO.getFullAddress().isEmpty()) {
                throw new CustomException("Full address cannot be empty");
            }
            if (addressRequestDTO.getPhone() == null || addressRequestDTO.getPhone().isEmpty()) {
                throw new CustomException("Phone cannot be empty");
            }
            if (addressRequestDTO.getReceiveName() == null || addressRequestDTO.getReceiveName().isEmpty()) {
                throw new CustomException("Receive name cannot be empty");
            }

            // Tạo địa chỉ mới từ AddressRequestDTO
            Address address = AddressMapper.INSTANCE.addressRequestDTOToAddress(addressRequestDTO, user);
            address.setUser(user);

            // Lưu địa chỉ mới vào cơ sở dữ liệu
            Address savedAddress = addressRepository.save(address);

            // Trả về thông tin địa chỉ mới
            return AddressMapper.INSTANCE.toAddressResponseDTO(savedAddress);
        } catch (CustomException ce) {
            throw ce;
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while adding address");
        }
    }

    //Xóa địa chỉ
    @Override
    @Transactional
    public void deleteAddress(Long addressId) throws CustomException{
        try {
            User user = getCurrentUser();
            // Kiểm tra địa chỉ có tồn tại và thuộc về người dùng hiện tại
            Address address = addressRepository.findById(addressId)
                    .orElseThrow(() -> new CustomException("Address not found"));

            if (!address.getUser().getUserId().equals(user.getUserId())) {
                throw new CustomException("You are not authorized to delete this address");
            }

            addressRepository.delete(address);
        } catch (CustomException ce) {
            throw ce;
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while deleting address");
        }
    }

    @Override
    public List<AddressResponseDTO> getAddresses() throws CustomException{
        try {
            User user = getCurrentUser();
            // Lấy danh sách địa chỉ thuộc về người dùng hiện tại
            List<Address> addresses = addressRepository.findByUser(user);

            // Chuyển đổi danh sách địa chỉ sang danh sách AddressResponseDTO
            return addresses.stream()
                    .map(AddressMapper.INSTANCE::toAddressResponseDTO)
                    .collect(Collectors.toList());
        } catch (CustomException ce) {
            throw ce;
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while getting addresses");
        }
    }

    //Lấy thông tin địa chỉ theo addressId
    @Override
    public AddressResponseDTO getAddressById(Long addressId) {
        try {
            User user = getCurrentUser();
            Address address = addressRepository.findByAddressId(addressId);
            if (address == null) {
                throw new CustomException("Address not found");
            }
            if (!address.getUser().getUserId().equals(user.getUserId())) {
                throw new CustomException("You are not authorized to get this address");
            }
            return AddressMapper.INSTANCE.toAddressResponseDTO(address);
        } catch (CustomException ce) {
            throw ce;
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while getting address");
        }
    }

    @Override
    public void setDefaultAddress(Long addressId) throws CustomException {
        User user = getCurrentUser();
        Address address = addressRepository.findByAddressId(addressId);
        if (address == null || !address.getUser().getUserId().equals(user.getUserId())) {
            throw new CustomException("Address not found or you are not authorized to set this address as default");
        }

        // Unset the current default address
        Optional<Address> currentDefaultAddress = addressRepository.findByUserUserIdAndIsDefault(user.getUserId(), true);
        currentDefaultAddress.ifPresent(addr -> {
            addr.setIsDefault(false);
            addressRepository.save(addr);
        });

        // Set the new default address
        address.setIsDefault(true);
        addressRepository.save(address);
    }

    @Override
    public AddressResponseDTO getDefaultAddress() throws CustomException {
        User user = getCurrentUser();
        Optional<Address> defaultAddress = addressRepository.findByUserUserIdAndIsDefault(user.getUserId(), true);
        if (defaultAddress.isPresent()) {
            return AddressMapper.INSTANCE.toAddressResponseDTO(defaultAddress.get());
        }
        throw new CustomException("No default address found");
    }

    @Override
    public AddressResponseDTO updateAddress(Long addressId, AddressRequestDTO addressRequestDTO) throws CustomException {
        try {
            User user = getCurrentUser();
            Address address = addressRepository.findByAddressId(addressId);
            if (address == null || !address.getUser().getUserId().equals(user.getUserId())) {
                throw new CustomException("Address not found or you are not authorized to update this address");
            }
            if (addressRequestDTO.getFullAddress() == null || addressRequestDTO.getFullAddress().isEmpty()) {
                throw new CustomException("Full address cannot be empty");
            }
            if (addressRequestDTO.getPhone() == null || addressRequestDTO.getPhone().isEmpty()) {
                throw new CustomException("Phone cannot be empty");
            }
            if (addressRequestDTO.getReceiveName() == null || addressRequestDTO.getReceiveName().isEmpty()) {
                throw new CustomException("Receive name cannot be empty");
            }
            address.setFullAddress(addressRequestDTO.getFullAddress());
            address.setPhone(addressRequestDTO.getPhone());
            address.setReceiveName(addressRequestDTO.getReceiveName());
            return AddressMapper.INSTANCE.toAddressResponseDTO(addressRepository.save(address));
        } catch (CustomException ce) {
            throw ce;
        }
    }
}
