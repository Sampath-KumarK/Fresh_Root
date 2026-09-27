package com.freshroots.service;

import com.freshroots.dto.Dtos.*;
import com.freshroots.model.Category;
import com.freshroots.model.Product;
import com.freshroots.repository.CategoryRepository;
import com.freshroots.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PublicService {
    @Autowired CategoryRepository categoryRepository;
    @Autowired ProductRepository productRepository;

    public List<CategoryDTO> getCategories() {
        return categoryRepository.findAll().stream()
                .map(c -> new CategoryDTO(c.getId(), c.getName())).collect(Collectors.toList());
    }

    public List<ProductDTO> getProducts(Long categoryId, String search) {
        List<Product> products = productRepository.findPublicProducts(categoryId, search);
        return products.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public ProductDTO getProduct(Long id) {
        Product p = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        return mapToDTO(p);
    }

    public Product getProductEntity(Long id) {
        return productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
    }

    private ProductDTO mapToDTO(Product p) {
        ProductDTO dto = new ProductDTO();
        dto.setId(p.getId()); dto.setName(p.getName()); dto.setDescription(p.getDescription());
        dto.setPrice(p.getPrice()); dto.setUnit(p.getUnit()); dto.setStock(p.getStock());
        dto.setImageUrl(p.getImageUrl());
        if (p.getCategory() != null) {
            dto.setCategoryId(p.getCategory().getId()); dto.setCategoryName(p.getCategory().getName());
        }
        if (p.getFarmer() != null) {
            dto.setFarmerId(p.getFarmer().getId()); dto.setFarmerName(p.getFarmer().getName());
            dto.setFarmerLocation(p.getFarmer().getLocation());
        }
        dto.setVisible(p.getVisible());
        return dto;
    }
}
