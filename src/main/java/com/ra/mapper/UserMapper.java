package com.ra.mapper;

import com.ra.model.dto.request.SignupRequestDTO;
import com.ra.model.dto.request.UserRequestDTO;
import com.ra.model.dto.response.UserResponseDTO;
import com.ra.model.entity.ERole;
import com.ra.model.entity.Role;
import com.ra.model.entity.User;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    default UserResponseDTO userToUserResponseDTO(User user) {
        UserResponseDTO responseDTO = new UserResponseDTO();
        responseDTO.setUserId(user.getUserId());
        responseDTO.setUsername(user.getUsername());
        responseDTO.setEmail(user.getEmail());
        responseDTO.setFullname(user.getFullname());
        responseDTO.setPhone(user.getPhone());
        responseDTO.setAddress(user.getAddress());
        responseDTO.setAvatar(user.getAvatar());
        responseDTO.setCreatedAt(user.getCreatedAt());
        responseDTO.setUpdatedAt(user.getUpdatedAt());
        responseDTO.setRoleName(mapRoleNames(user.getRoles()));
        responseDTO.setStatusDescription(user.getStatus() ? "Đang mở khóa" : "Đã khóa");
        responseDTO.setStatus(user.getStatus());
        responseDTO.setIsDeleted(user.getIsDeleted());
        return responseDTO;
    }

    default List<String> mapRoleNames(Set<Role> roles) {
        return roles.stream()
                .map(role -> role.getRoleName().name())
                .collect(Collectors.toList());
    }

    @Named("mapMultipartFileToString")
    default String mapMultipartFileToString(MultipartFile multipartFile) {
        if (multipartFile == null || multipartFile.isEmpty()) {
            return null;
        }
        try {
            // Convert MultipartFile to String, for example, by converting it to Base64
            return java.util.Base64.getEncoder().encodeToString(multipartFile.getBytes());
        } catch (IOException e) {
            throw new RuntimeException("Failed to convert MultipartFile to String", e);
        }
    }

    @Named("mapStringToMultipartFile")
    default MultipartFile mapStringToMultipartFile(String avatar) {
        if (avatar == null) {
            return null;
        }
        try {
            // Convert String to MultipartFile, for example, by decoding Base64
            byte[] bytes = java.util.Base64.getDecoder().decode(avatar);
            return new MultipartFile() {
                @Override
                public String getName() {
                    return "avatar";
                }

                @Override
                public String getOriginalFilename() {
                    return "avatar.png"; // or any appropriate filename
                }

                @Override
                public String getContentType() {
                    return "image/png"; // or any appropriate content type
                }

                @Override
                public boolean isEmpty() {
                    return bytes.length == 0;
                }

                @Override
                public long getSize() {
                    return bytes.length;
                }

                @Override
                public byte[] getBytes() throws IOException {
                    return bytes;
                }

                @Override
                public InputStream getInputStream() throws IOException {
                    return new ByteArrayInputStream(bytes);
                }

                @Override
                public void transferTo(File dest) throws IOException, IllegalStateException {
                    // Implement if needed
                }
            };
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert String to MultipartFile", e);
        }
    }
}