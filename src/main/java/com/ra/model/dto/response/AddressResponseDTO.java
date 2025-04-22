package com.ra.model.dto.response;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class AddressResponseDTO {
    private Long addressId;
    private String fullAddress;
    private String phone;
    private String receiveName;
    private Boolean isDefault;
}
