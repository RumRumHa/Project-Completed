package com.ra.model.dto.response;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class UserResponseDTO {
    private Long userId;
    private String username;
    private String email;
    private String fullname;
    private String phone;
    private String address;
    private String avatar;
    private Date createdAt;
    private Date updatedAt;
    private List<String> roleName;
    private String statusDescription;
    private Boolean status;
    private Boolean isDeleted;
}
