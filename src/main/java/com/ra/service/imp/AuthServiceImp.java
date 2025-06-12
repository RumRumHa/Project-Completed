package com.ra.service.imp;

import com.ra.exception.CustomException;
import com.ra.mapper.UserMapper;
import com.ra.model.dto.request.SignupRequestDTO;
import com.ra.model.dto.request.UserRequestDTO;
import com.ra.model.entity.ERole;
import com.ra.model.entity.User;
import com.ra.repository.UserRepository;
import com.ra.service.AuthService;
import com.ra.service.CloudinaryService;
import com.ra.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Date;
import java.util.Optional;

@Service
public class AuthServiceImp implements AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleService roleService;

    @Autowired
    private BCryptPasswordEncoder encoder;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Override
    public void register(SignupRequestDTO signupRequestDTO) {
        // 1. Kiểm tra dữ liệu đầu vào (trùng lặp)
        if (userRepository.existsByUsername(signupRequestDTO.getUsername())) {
            throw new CustomException("Tên đăng nhập đã tồn tại.");
        }
        if (userRepository.existsByEmail(signupRequestDTO.getEmail())) {
            throw new CustomException("Email đã tồn tại.");
        }
        if (signupRequestDTO.getPhone() != null && !signupRequestDTO.getPhone().isEmpty() && userRepository.existsByPhone(signupRequestDTO.getPhone())) {
            throw new CustomException("Số điện thoại đã tồn tại.");
        }

        // 2. Tạo đối tượng User từ DTO
        User user = new User();
        user.setUsername(signupRequestDTO.getUsername());
        user.setEmail(signupRequestDTO.getEmail());
        user.setPassword(encoder.encode(signupRequestDTO.getPassword()));
        user.setFullname(signupRequestDTO.getFullname());
        user.setPhone(signupRequestDTO.getPhone());
        user.setAddress(signupRequestDTO.getAddress());

        // Tải lên hình ảnh đại diện nếu có
        if (signupRequestDTO.getAvatar() != null && !signupRequestDTO.getAvatar().isEmpty()) {
            String avatarUrl = cloudinaryService.uploadFile(signupRequestDTO.getAvatar());
            user.setAvatar(avatarUrl);
        }

        // 3. Thiết lập các giá trị mặc định
        user.setStatus(true);
        user.setIsDeleted(false);
        user.setRoles(Collections.singleton(roleService.findByRoleName(ERole.USER)));
        user.setCreatedAt(new Date());
        user.setUpdatedAt(new Date());

        // 4. Lưu vào cơ sở dữ liệu
        userRepository.save(user);
    }

    @Override
    public User authenticateUser(String username, String password) {
        // Tìm người dùng theo username, nếu không có thì báo lỗi
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new CustomException("Tên đăng nhập hoặc mật khẩu không đúng."));

        // So sánh password người dùng nhập với mật khẩu đã mã hóa trong DB
        if (!encoder.matches(password, user.getPassword())) {
            throw new CustomException("Tên đăng nhập hoặc mật khẩu không đúng.");
        }

        return user;
    }
}
