package com.freshroots.service;

import com.freshroots.dto.Dtos.*;
import com.freshroots.model.*;
import com.freshroots.repository.*;
import com.freshroots.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FarmerService {
    @Autowired ProductRepository productRepository;
    @Autowired CategoryRepository categoryRepository;
    @Autowired UserRepository userRepository;
    @Autowired OrderItemRepository orderItemRepository;

    public List<ProductDTO> getFarmerProducts(CustomUserDetails user) {
        return productRepository.findByFarmerId(user.getId()).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public MessageResponse addProduct(CustomUserDetails user, FarmerProductRequest req) {
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
        return new MessageResponse("Product added successfully");
    }

    public MessageResponse updateProduct(CustomUserDetails user, Long id, FarmerProductRequest req) {
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
        return new MessageResponse("Product updated successfully");
    }

    public MessageResponse deleteProduct(CustomUserDetails user, Long id) {
        Product p = productRepository.findById(id).orElseThrow();
        if(!p.getFarmer().getId().equals(user.getId())) throw new RuntimeException("Unauthorized");
        productRepository.delete(p);
        return new MessageResponse("Product deleted successfully");
    }

    public List<FarmerOrderItemDTO> getFarmerOrders(CustomUserDetails user) {
        List<OrderItem> items = orderItemRepository.findByFarmerIdOrderByOrderCreatedAtDesc(user.getId());
        return items.stream().map(i -> {
            FarmerOrderItemDTO dto = new FarmerOrderItemDTO();
            dto.setOrderItemId(i.getId()); dto.setOrderId(i.getOrder().getId());
            dto.setProductName(i.getProduct().getName()); dto.setQuantity(i.getQuantity());
            dto.setPrice(i.getPrice()); dto.setStatus(i.getStatus());
            dto.setCustomerName(i.getOrder().getCustomer().getName());
            dto.setCustomerPhone(i.getOrder().getCustomer().getPhone());
            dto.setAddress(i.getOrder().getAddress());
            dto.setCreatedAt(i.getOrder().getCreatedAt());
            return dto;
        }).collect(Collectors.toList());
    }

    public MessageResponse updateOrderItemStatus(CustomUserDetails user, Long id, OrderItemStatusRequest req) {
        OrderItem item = orderItemRepository.findById(id).orElseThrow();
        if(!item.getFarmer().getId().equals(user.getId())) throw new RuntimeException("Unauthorized");
        item.setStatus(req.getStatus());
        orderItemRepository.save(item);
        return new MessageResponse("Status updated");
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
            java.net.URLConnection connection = url.openConnection();
            connection.setConnectTimeout(3000);
            connection.setReadTimeout(5000);
            try (java.io.InputStream is = connection.getInputStream();
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
