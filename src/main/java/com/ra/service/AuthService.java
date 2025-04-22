package com.ra.service;

import com.ra.model.dto.request.SignupRequestDTO;
import com.ra.model.dto.request.UserRequestDTO;
import com.ra.model.entity.User;

import java.util.Optional;

public interface AuthService {
    boolean existsByUsernameOrEmail(String username, String email);
    void saveUser(SignupRequestDTO signupRequestDTO);
    User authenticateUser(String username, String password);
    void registerUser(SignupRequestDTO signupRequestDTO);
}
