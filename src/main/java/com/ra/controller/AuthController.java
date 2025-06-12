package com.ra.controller;

import com.ra.model.dto.request.LoginRequestDTO;
import com.ra.model.dto.request.SignupRequestDTO;
import com.ra.model.dto.response.JwtResponse;
import com.ra.model.dto.response.MessageResponse;
import com.ra.model.entity.User;
import com.ra.security.jwt.JwtUtils;
import com.ra.service.AuthService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("api/v1/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtils jwtUtils;

    // Đăng kí tài khoản người dùng
    @PostMapping("/sign-up")
    public ResponseEntity<MessageResponse> registerUser(@Valid @ModelAttribute SignupRequestDTO signupRequestDTO) {
        authService.register(signupRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new MessageResponse("Đăng ký tài khoản thành công!"));
    }

    // Đăng nhập tài khoản
    @PostMapping("/sign-in")
    public ResponseEntity<JwtResponse> loginUser(@Valid @RequestBody LoginRequestDTO loginRequestDTO) {
        User user = authService.authenticateUser(loginRequestDTO.getUsername(), loginRequestDTO.getPassword());
        String jwt = jwtUtils.generateJwtToken(user);
        return ResponseEntity.ok(new JwtResponse(jwt));
    }
}
