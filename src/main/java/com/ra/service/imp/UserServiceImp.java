package com.ra.service.imp;

import com.ra.exception.CustomException;
import com.ra.mapper.AddressMapper;
import com.ra.mapper.ProductMapper;
import com.ra.mapper.UserMapper;
import com.ra.model.dto.request.AddressRequestDTO;
import com.ra.model.dto.request.ChangePasswordRequestDTO;
import com.ra.model.dto.request.UserRequestDTO;
import com.ra.model.dto.response.AddressResponseDTO;
import com.ra.model.dto.response.UserResponseDTO;
import com.ra.model.entity.*;
import com.ra.repository.AddressRepository;
import com.ra.repository.RoleRepository;
import com.ra.repository.UserRepository;
import com.ra.security.CustomUserDetails;
import com.ra.service.CloudinaryService;
import com.ra.service.UserService;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserServiceImp implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Override
    @Transactional
    public Page<UserResponseDTO> getUsers(Pageable pageable) {
        Page<User> users = userRepository.findByIsDeletedFalse(pageable);
        return users.map(UserMapper.INSTANCE::userToUserResponseDTO);
    }

    //Thêm quyền cho người dùng
    @Override
    @Transactional
    public UserResponseDTO addRoleToUser(Long userId, Long roleId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new CustomException("User not found"));

            Role role = roleRepository.findById(roleId)
                    .orElseThrow(() -> new CustomException("Role not found"));

            user.getRoles().add(role);
            User updatedUser = userRepository.save(user);
            return UserMapper.INSTANCE.userToUserResponseDTO(updatedUser);
        } catch (CustomException e) {
            throw e; // Throwing lại CustomException để người dùng hoặc hệ thống gọi API có thể xử lý
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while adding roles to user");
        }
    }

    //Xóa quyền của người dùng
    @Override
    @Transactional
    public UserResponseDTO removeRoleFromUser(Long userId, Long roleId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new CustomException("User not found"));

            Role role = roleRepository.findById(roleId)
                    .orElseThrow(() -> new CustomException("Role not found"));

            user.getRoles().remove(role);
            User updatedUser = userRepository.save(user);
            return UserMapper.INSTANCE.userToUserResponseDTO(updatedUser);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while removing roles from user");
        }
    }

    //Khóa / Mở khóa người dùng
    @Override
    @Transactional
    public UserResponseDTO updateUserStatus(Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new CustomException("User not found"));

            user.setStatus(!user.getStatus());
            User updatedUser = userRepository.save(user);
            return UserMapper.INSTANCE.userToUserResponseDTO(updatedUser);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while updating user status");
        }
    }

    //Tìm kiếm người dùng theo tên
    @Override
    @Transactional
    public Page<UserResponseDTO> searchUsers(String keyword, Pageable pageable) {
        Page<User> users = userRepository.searchByKeyword(keyword, pageable);
        return users.map(UserMapper.INSTANCE::userToUserResponseDTO);
    }

    // Phương thức kiểm tra xác thực và lấy thông tin người dùng
    private User getCurrentUser() throws CustomException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new CustomException("User is not authenticated");
        }
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userDetails.getUser();
    }

    //Thông tin tài khoản người dùng
    @Override
    public UserResponseDTO getUserAccountInfo() throws CustomException {
        try {
            User user = getCurrentUser();
            return UserMapper.INSTANCE.userToUserResponseDTO(user);
        } catch (CustomException ce) {
            throw ce;
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while retrieving user account info");
        }
    }

    //Cập nhật thông tin người dùng
    @Override
    public UserResponseDTO updateUserAccountInfo(UserRequestDTO userRequestDTO) throws CustomException {
        try {
            User user = getCurrentUser();
            // Cập nhật thông tin người dùng từ userResponseDTO
            if (userRequestDTO.getUsername() != null && !userRequestDTO.getUsername().isEmpty()) {
                user.setUsername(userRequestDTO.getUsername());
            }
            if (userRequestDTO.getEmail() != null && !userRequestDTO.getEmail().isEmpty()) {
                user.setEmail(userRequestDTO.getEmail());
            }
            if (userRequestDTO.getFullname() != null && !userRequestDTO.getFullname().isEmpty()) {
                user.setFullname(userRequestDTO.getFullname());
            }
            if (userRequestDTO.getPhone() != null && !userRequestDTO.getPhone().isEmpty()) {
                user.setPhone(userRequestDTO.getPhone());
            }
            if (userRequestDTO.getAddress() != null && !userRequestDTO.getAddress().isEmpty()) {
                user.setAddress(userRequestDTO.getAddress());
            }
            if (userRequestDTO.getAvatar() != null && !userRequestDTO.getAvatar().isEmpty()) {
                String avatarUrl = cloudinaryService.uploadFile(userRequestDTO.getAvatar());
                user.setAvatar(avatarUrl);
            }

            userRepository.save(user);
            return UserMapper.INSTANCE.userToUserResponseDTO(user);
        } catch (CustomException ce) {
            throw ce;
        } catch (Exception e) {
            e.printStackTrace();
            throw new CustomException("An unexpected error occurred while updating user info");
        }
    }

    //Thay đổi mật khẩu (payload : oldPass, newPass, confirmNewPass)
    @Override
    public void changePassword(ChangePasswordRequestDTO request) throws CustomException {
        try {
            User user = getCurrentUser();

            // Kiểm tra mật khẩu cũ
            if (!passwordEncoder.matches(request.getOldPass(), user.getPassword())) {
                throw new CustomException("Old password is incorrect");
            }

            // Kiểm tra mật khẩu mới và xác nhận mật khẩu mới
            if (request.getNewPass() == null || request.getNewPass().isEmpty()) {
                throw new CustomException("New password cannot be empty");
            }
            if (!request.getNewPass().equals(request.getConfirmNewPass())) {
                throw new CustomException("New password and confirm password do not match");
            }

            // Cập nhật mật khẩu mới
            user.setPassword(passwordEncoder.encode(request.getNewPass()));
            userRepository.save(user);
        } catch (CustomException ce) {
            throw ce;
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while changing password");
        }
    }

    @Override
    @Transactional
    public Boolean deleteUser(Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new CustomException("User not found"));
            user.setIsDeleted(true);
            userRepository.save(user);
            return true;
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while deleting user");
        }
    }

    @Override
    @Transactional
    public UserResponseDTO updateUser(UserRequestDTO userRequestDTO) {
        try {
            Long userId = userRequestDTO.getUserId();
            if (userId == null) {
                throw new CustomException("User ID is required");
            }

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new CustomException("User not found"));

            // Cập nhật thông tin người dùng từ userRequestDTO
            if (userRequestDTO.getUsername() != null && !userRequestDTO.getUsername().isEmpty()) {
                user.setUsername(userRequestDTO.getUsername());
            }
            if (userRequestDTO.getEmail() != null && !userRequestDTO.getEmail().isEmpty()) {
                user.setEmail(userRequestDTO.getEmail());
            }
            if (userRequestDTO.getFullname() != null && !userRequestDTO.getFullname().isEmpty()) {
                user.setFullname(userRequestDTO.getFullname());
            }
            if (userRequestDTO.getPhone() != null && !userRequestDTO.getPhone().isEmpty()) {
                user.setPhone(userRequestDTO.getPhone());
            }
            if (userRequestDTO.getAddress() != null && !userRequestDTO.getAddress().isEmpty()) {
                user.setAddress(userRequestDTO.getAddress());
            }
            if (userRequestDTO.getAvatar() != null && !userRequestDTO.getAvatar().isEmpty()) {
                String avatarUrl = cloudinaryService.uploadFile(userRequestDTO.getAvatar());
                user.setAvatar(avatarUrl);
            }

            userRepository.save(user);
            return UserMapper.INSTANCE.userToUserResponseDTO(user);
        } catch (CustomException ce) {
            throw ce;
        } catch (Exception e) {
            e.printStackTrace();
            throw new CustomException("An unexpected error occurred while updating user info");
        }
    }

    @Override
    public UserResponseDTO getUserById(Long userId) throws CustomException {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new CustomException("User not found"));
            return UserMapper.INSTANCE.userToUserResponseDTO(user);
        } catch (CustomException ce) {
            throw ce;
        }
    }
}
