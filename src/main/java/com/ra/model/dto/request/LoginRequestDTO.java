package com.ra.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class LoginRequestDTO {
    @NotBlank
    private String username;
    @NotBlank
    private String password;
}
