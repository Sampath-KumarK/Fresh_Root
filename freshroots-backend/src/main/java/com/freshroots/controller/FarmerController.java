package com.freshroots.controller;
import com.freshroots.dto.Dtos.*;
import com.freshroots.model.*;
import com.freshroots.repository.*;
import com.freshroots.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;
@RestController
@RequestMapping("/api/farmer")
public class FarmerController {
    @Autowired ProductRepository productRepository;
    @Autowired CategoryRepository categoryRepository;
    @Autowired UserRepository userRepository;
    @Autowired OrderItemRepository orderItemRepository;

    @GetMapping("/products")
    public ResponseEntity<List<ProductDTO>> getFarmerProducts(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(productRepository.findByFarmerId(user.getId()).stream().map(this::mapToDTO).collect(Collectors.toList()));
    }

    @PostMapping("/products")
    public ResponseEntity<MessageResponse> addProduct(@AuthenticationPrincipal CustomUserDetails user, @RequestBody FarmerProductRequest req) {
        Product p = new Product();
        p.setName(req.getName()); p.setDescription(req.getDescription()); p.setPrice(req.getPrice());
        p.setUnit(req.getUnit()); p.setStock(req.getStock()); p.setImageUrl(req.getImageUrl());
        p.setCategory(categoryRepository.findById(req.getCategoryId()).orElse(null));
        p.setFarmer(userRepository.findById(user.getId()).orElse(null));
        
        byte[] bytes = downloadImage(req.getImageUrl());
        if (bytes != null) {
            p.setImageBytes(bytes);
            p.setImageType("image/jpeg");
        }

        productRepository.save(p);
        return ResponseEntity.ok(new MessageResponse("Product added successfully"));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<MessageResponse> updateProduct(@AuthenticationPrincipal CustomUserDetails user, @PathVariable Long id, @RequestBody FarmerProductRequest req) {
        Product p = productRepository.findById(id).orElseThrow();
        if(!p.getFarmer().getId().equals(user.getId())) throw new RuntimeException("Unauthorized");
        p.setName(req.getName()); p.setDescription(req.getDescription()); p.setPrice(req.getPrice());
        p.setUnit(req.getUnit()); p.setStock(req.getStock()); p.setImageUrl(req.getImageUrl());
        p.setCategory(categoryRepository.findById(req.getCategoryId()).orElse(null));
        
        boolean urlChanged = req.getImageUrl() != null && !req.getImageUrl().equals(p.getImageUrl());
        if (urlChanged || p.getImageBytes() == null) {
            byte[] bytes = downloadImage(req.getImageUrl());
            if (bytes != null) {
                p.setImageBytes(bytes);
                p.setImageType("image/jpeg");
            }
        }

        productRepository.save(p);
        return ResponseEntity.ok(new MessageResponse("Product updated successfully"));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<MessageResponse> deleteProduct(@AuthenticationPrincipal CustomUserDetails user, @PathVariable Long id) {
        Product p = productRepository.findById(id).orElseThrow();
        if(!p.getFarmer().getId().equals(user.getId())) throw new RuntimeException("Unauthorized");
        productRepository.delete(p);
        return ResponseEntity.ok(new MessageResponse("Product deleted successfully"));
    }

    @GetMapping("/orders")
    public ResponseEntity<List<FarmerOrderItemDTO>> getFarmerOrders(@AuthenticationPrincipal CustomUserDetails user) {
        List<OrderItem> items = orderItemRepository.findByFarmerIdOrderByOrderCreatedAtDesc(user.getId());
        return ResponseEntity.ok(items.stream().map(i -> {
            FarmerOrderItemDTO dto = new FarmerOrderItemDTO();
            dto.setOrderItemId(i.getId()); dto.setOrderId(i.getOrder().getId());
            dto.setProductName(i.getProduct().getName()); dto.setQuantity(i.getQuantity());
            dto.setPrice(i.getPrice()); dto.setStatus(i.getStatus());
            dto.setCustomerName(i.getOrder().getCustomer().getName());
            dto.setCustomerPhone(i.getOrder().getCustomer().getPhone());
            dto.setAddress(i.getOrder().getAddress());
            dto.setCreatedAt(i.getOrder().getCreatedAt());
            return dto;
        }).collect(Collectors.toList()));
    }

    @PutMapping("/order-items/{id}/status")
    public ResponseEntity<MessageResponse> updateOrderItemStatus(@AuthenticationPrincipal CustomUserDetails user, @PathVariable Long id, @RequestBody OrderItemStatusRequest req) {
        OrderItem item = orderItemRepository.findById(id).orElseThrow();
        if(!item.getFarmer().getId().equals(user.getId())) throw new RuntimeException("Unauthorized");
        item.setStatus(req.getStatus());
        orderItemRepository.save(item);
        return ResponseEntity.ok(new MessageResponse("Status updated"));
    }

    private ProductDTO mapToDTO(Product p) {
        ProductDTO dto = new ProductDTO();
        dto.setId(p.getId()); dto.setName(p.getName()); dto.setDescription(p.getDescription());
        dto.setPrice(p.getPrice()); dto.setUnit(p.getUnit()); dto.setStock(p.getStock());
        dto.setImageUrl(p.getImageUrl()); dto.setVisible(p.getVisible());
        if (p.getCategory() != null) { dto.setCategoryId(p.getCategory().getId()); dto.setCategoryName(p.getCategory().getName()); }
        if (p.getFarmer() != null) { dto.setFarmerId(p.getFarmer().getId()); dto.setFarmerName(p.getFarmer().getName()); dto.setFarmerLocation(p.getFarmer().getLocation()); }
        return dto;
    }

    private byte[] downloadImage(String urlString) {
        try {
            if (urlString == null || urlString.isEmpty()) return null;
            java.net.URL url = new java.net.URL(urlString);
            try (java.io.InputStream is = url.openStream();
                 java.io.ByteArrayOutputStream baos = new java.io.ByteArrayOutputStream()) {
                byte[] b = new byte[2048];
                int length;
                while ((length = is.read(b)) != -1) {
                    baos.write(b, 0, length);
                }
                return baos.toByteArray();
            }
        } catch (Exception e) {
            System.err.println("Could not download image: " + urlString);
            return null;
        }
    }
}
