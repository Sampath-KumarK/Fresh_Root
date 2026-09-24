package com.freshroots.controller;
import com.freshroots.dto.Dtos.*;
import com.freshroots.model.Category;
import com.freshroots.model.Product;
import com.freshroots.repository.CategoryRepository;
import com.freshroots.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;
@RestController
@RequestMapping("/api")
public class PublicController {
    @Autowired CategoryRepository categoryRepository;
    @Autowired ProductRepository productRepository;

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryDTO>> getCategories() {
        return ResponseEntity.ok(categoryRepository.findAll().stream()
                .map(c -> new CategoryDTO(c.getId(), c.getName())).collect(Collectors.toList()));
    }

    @GetMapping("/products")
    public ResponseEntity<List<ProductDTO>> getProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search) {
        List<Product> products = productRepository.findPublicProducts(categoryId, search);
        return ResponseEntity.ok(products.stream().map(this::mapToDTO).collect(Collectors.toList()));
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<ProductDTO> getProduct(@PathVariable Long id) {
        Product p = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        return ResponseEntity.ok(mapToDTO(p));
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
