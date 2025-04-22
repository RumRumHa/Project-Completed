package com.ra.model.dto.request;

import com.ra.model.entity.Role;
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
    private String username;
    private String email;
    private String fullname;
    private String password;
    private MultipartFile avatar;
    private String phone;
    private String address;
    private Boolean status;
    private Boolean isDeleted;
    private Set<Role> roles;
    private Date createdAt;
    private Date updatedAt;
}