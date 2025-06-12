package com.ra.service;

import com.ra.model.dto.request.SignupRequestDTO;
import com.ra.model.entity.User;

public interface AuthService {
    void register(SignupRequestDTO signupRequestDTO);
    User authenticateUser(String username, String password);
}
