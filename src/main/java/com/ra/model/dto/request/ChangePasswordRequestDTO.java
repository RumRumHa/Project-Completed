package com.ra.model.dto.request;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ChangePasswordRequestDTO {
    private String oldPass;
    private String newPass;
    private String confirmNewPass;
}
