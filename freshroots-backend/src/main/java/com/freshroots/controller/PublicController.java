package com.freshroots.controller;
import com.freshroots.dto.Dtos.*;
import com.freshroots.model.Product;
import com.freshroots.service.PublicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
public class PublicController {
    @Autowired
    private PublicService publicService;

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryDTO>> getCategories() {
        return ResponseEntity.ok(publicService.getCategories());
    }

    @GetMapping("/products")
    public ResponseEntity<List<ProductDTO>> getProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(publicService.getProducts(categoryId, search));
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<ProductDTO> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(publicService.getProduct(id));
    }

    @GetMapping("/products/{id}/image")
    public ResponseEntity<byte[]> getProductImage(@PathVariable Long id) {
        Product p = publicService.getProductEntity(id);
        if (p.getImageBytes() == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .header(org.springframework.http.HttpHeaders.CONTENT_TYPE, p.getImageType() != null ? p.getImageType() : org.springframework.http.MediaType.IMAGE_JPEG_VALUE)
                .body(p.getImageBytes());
    }
}
