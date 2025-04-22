package com.ra.mapper;

import com.ra.model.dto.response.CategoryResponseDTO;
import com.ra.model.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryMapper INSTANCE = Mappers.getMapper(CategoryMapper.class);

    default CategoryResponseDTO categoryToCategoryResponseDTO(Category category) {
        CategoryResponseDTO responseDTO = new CategoryResponseDTO();
        responseDTO.setCategoryId(category.getCategoryId());
        responseDTO.setCategoryName(category.getCategoryName());
        responseDTO.setDescription(category.getDescription());
        responseDTO.setStatus(category.getStatus());
        return responseDTO;
    }
}
