package com.ra.service;

import com.ra.exception.CustomException;
import com.ra.model.dto.request.AddressRequestDTO;
import com.ra.model.dto.request.ChangePasswordRequestDTO;
import com.ra.model.dto.request.UserRequestDTO;
import com.ra.model.dto.response.AddressResponseDTO;
import com.ra.model.dto.response.UserResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Set;

public interface UserService {
    Page<UserResponseDTO> getUsers(Pageable pageable);
    UserResponseDTO addRoleToUser(Long userId, Long roleId);
    UserResponseDTO removeRoleFromUser(Long userId, Long roleId);
    UserResponseDTO updateUserStatus(Long userId);
    Page<UserResponseDTO> searchUsers(String username, Pageable pageable);
    UserResponseDTO getUserAccountInfo() throws CustomException;
    UserResponseDTO updateUserAccountInfo(UserRequestDTO userRequestDTO) throws CustomException;
    void changePassword(ChangePasswordRequestDTO request) throws CustomException;
    Boolean deleteUser(Long userId) throws CustomException;
    UserResponseDTO updateUser(UserRequestDTO userRequestDTO) throws CustomException;
    UserResponseDTO getUserById(Long userId) throws CustomException;
}
