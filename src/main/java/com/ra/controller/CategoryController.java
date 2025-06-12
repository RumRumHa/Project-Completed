package com.ra.controller;

import com.ra.model.dto.response.CategoryResponseDTO;
import com.ra.model.dto.request.CategoryRequestDTO;
import com.ra.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("api/v1/categories")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public ResponseEntity<Page<CategoryResponseDTO>> getCategories(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "categoryName") String sortBy,
            @RequestParam(defaultValue = "asc") String orderBy
    ) {
        Sort.Direction direction = orderBy.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, limit, Sort.by(direction, sortBy));
        Page<CategoryResponseDTO> response = categoryService.getCategories(pageable);
        return ResponseEntity.ok(response);
    }

    //Thêm mới danh mục
    @PostMapping
    public ResponseEntity<CategoryResponseDTO> createCategory(@Valid @ModelAttribute CategoryRequestDTO categoryRequestDTO) {
        CategoryResponseDTO newCategory = categoryService.addCategory(categoryRequestDTO);
        return new ResponseEntity<>(newCategory, HttpStatus.CREATED);
    }

    //Cập nhật danh mục
    @PutMapping("/{categoryId}")
    public ResponseEntity<CategoryResponseDTO> updateCategory(@PathVariable Long categoryId, @Valid @ModelAttribute CategoryRequestDTO categoryRequestDTO) {
        CategoryResponseDTO updatedCategory = categoryService.updateCategory(categoryId, categoryRequestDTO);
        return ResponseEntity.ok(updatedCategory);
    }
}
