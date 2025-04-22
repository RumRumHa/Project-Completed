package com.ra.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class AddressRequestDTO {
    @NotBlank(message = "Full address cannot be empty")
    private String fullAddress;

    @NotBlank(message = "Phone cannot be empty")
    @Size(max = 12, message = "Phone must be less than 12 characters")
    private String phone;

    @NotBlank(message = "Receive name cannot be empty")
    @Size(max = 50, message = "Receive name must be less than 50 characters")
    private String receiveName;
}
