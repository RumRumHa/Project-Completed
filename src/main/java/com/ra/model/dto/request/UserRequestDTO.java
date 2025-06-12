package com.ra.model.dto.request;

import com.ra.model.entity.Role;
import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class UserRequestDTO {
    private Long userId;
    @NotBlank(message = "Tên đăng nhập không được để trống")
    @Size(min = 6, max = 100, message = "Tên đăng nhập phải từ 6 đến 100 ký tự")
    @Pattern(regexp = "^[a-zA-Z0-9]+$", message = "Tên đăng nhập không được chứa ký tự đặc biệt")
    private String username;
    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    private String email;
    @NotBlank(message = "Họ và tên không được để trống")
    @Size(max = 100, message = "Họ và tên không quá 100 ký tự")
    private String fullname;
    @NotBlank(message = "Mật khẩu không được để trống")
    private String password;
    private MultipartFile avatar;
    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^(\\+84|0)[0-9]{9,10}$", message = "Số điện thoại không đúng định dạng Việt Nam")
    private String phone;
    @NotBlank(message = "Địa chỉ không được để trống")
    @Size(max = 255, message = "Địa chỉ không quá 255 ký tự")
    private String address;
    private Boolean status;
    private Boolean isDeleted;
    private Set<Role> roles;
    private Date createdAt;
    private Date updatedAt;
}