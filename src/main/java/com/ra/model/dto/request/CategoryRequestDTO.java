package com.ra.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class CategoryRequestDTO {
    @NotBlank(message = "Category name cannot be blank")
    private String categoryName;
    private String description;
    private MultipartFile avatar;
}
