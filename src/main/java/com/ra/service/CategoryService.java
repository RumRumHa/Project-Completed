package com.ra.service;

import com.ra.model.dto.request.CategoryRequestDTO;
import com.ra.model.dto.response.CategoryResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CategoryService {
    Page<CategoryResponseDTO> getCategories(Pageable pageable);
    CategoryResponseDTO getCategoryById(Long categoryId);
    CategoryResponseDTO addCategory(CategoryRequestDTO categoryRequestDTO);
    CategoryResponseDTO updateCategory(Long categoryId, CategoryRequestDTO categoryRequestDTO);
    void deleteCategory(Long categoryId);
    Page<CategoryResponseDTO> searchByKeyword(String keyword, Pageable pageable);
}
