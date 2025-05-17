package com.ra.service.imp;

import com.ra.exception.CustomException;
import com.ra.mapper.CategoryMapper;
import com.ra.model.dto.request.CategoryRequestDTO;
import com.ra.model.dto.response.CategoryResponseDTO;
import com.ra.model.entity.Category;
import com.ra.repository.CategoryRepository;
import com.ra.repository.ProductRepository;
import com.ra.service.CategoryService;
import com.ra.service.CloudinaryService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class CategoryServiceImp implements CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    //Lấy về danh sách tất cả danh mục (sắp xếp và phân trang)
    @Override
    @Transactional
    public Page<CategoryResponseDTO> getCategories(Pageable pageable) {
        Page<Category> categories = categoryRepository.findAllByStatusTrue(pageable);
        return categories.map(CategoryMapper.INSTANCE::categoryToCategoryResponseDTO);
    }

    //Lấy về thông tin danh mục theo id
    @Override
    @Transactional
    public CategoryResponseDTO getCategoryById(Long categoryId) {
        try {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new CustomException("Category not found"));
            return CategoryMapper.INSTANCE.categoryToCategoryResponseDTO(category);
        } catch (CustomException ce) {
            throw ce;
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while retrieving the categories");
        }
    }

    //Thêm mới danh mục
    @Override
    @Transactional
    public CategoryResponseDTO addCategory(CategoryRequestDTO categoryRequestDTO) {
        try {
            Category category = Category.builder()
                    .categoryName(categoryRequestDTO.getCategoryName())
                    .description(categoryRequestDTO.getDescription())
                    .status(true)
                    .build();
            if (categoryRequestDTO.getAvatar() != null && !categoryRequestDTO.getAvatar().isEmpty()) {
                String avatar = cloudinaryService.uploadFile(categoryRequestDTO.getAvatar());
                category.setAvatar(avatar);
            }
            Category savedCategory = categoryRepository.save(category);
            return CategoryMapper.INSTANCE.categoryToCategoryResponseDTO(savedCategory);
        } catch (CustomException ce) {
            throw ce;
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while adding the category");
        }
    }

    //Chỉnh sửa thông tin danh mục
    @Override
    @Transactional
    public CategoryResponseDTO updateCategory(Long categoryId, CategoryRequestDTO categoryRequestDTO) {
        try {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new CustomException("Category not found"));
            category.setCategoryName(categoryRequestDTO.getCategoryName());
            category.setDescription(categoryRequestDTO.getDescription());
            if (categoryRequestDTO.getAvatar() != null && !categoryRequestDTO.getAvatar().isEmpty()) {
                String avatar = cloudinaryService.uploadFile(categoryRequestDTO.getAvatar());
                category.setAvatar(avatar);
            }

            Category updatedCategory = categoryRepository.save(category);
            return CategoryMapper.INSTANCE.categoryToCategoryResponseDTO(updatedCategory);
        } catch (CustomException ce) {
            throw ce;
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while updating the category");
        }
    }

    //Xóa danh mục
    @Override
    @Transactional
    public void deleteCategory(Long categoryId) {
        try {
            if (productRepository.existsByCategoryCategoryId(categoryId)) {
                throw new CustomException("Không thể xóa danh mục có chứa sản phẩm!");
            }
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new CustomException("Category not found"));

            category.setStatus(false);
            categoryRepository.save(category);
        } catch (CustomException ce) {
            throw ce;
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while deleting the category");
        }
    }

    @Override
    public Page<CategoryResponseDTO> searchByKeyword(String keyword, Pageable pageable) {
        Page<Category> categories = categoryRepository.searchByKeyword(keyword, pageable);
        return categories.map(category -> CategoryMapper.INSTANCE.categoryToCategoryResponseDTO(category));
    }
}
