package com.freshroots.controller;
import com.freshroots.dto.Dtos.*;
import com.freshroots.model.Product;
import com.freshroots.model.Role;
import com.freshroots.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;
@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired UserRepository userRepository;
    @Autowired ProductRepository productRepository;
    @Autowired OrderRepository orderRepository;
    @Autowired OrderItemRepository orderItemRepository;

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsDTO> getStats() {
        long farmers = userRepository.countByRole(Role.FARMER);
        long customers = userRepository.countByRole(Role.CUSTOMER);
        long products = productRepository.count();
        long orders = orderRepository.count();
        return ResponseEntity.ok(new AdminStatsDTO(farmers, customers, products, orders));
    }

    @GetMapping("/products")
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        return ResponseEntity.ok(productRepository.findAll().stream().map(p -> {
            ProductDTO dto = new ProductDTO();
            dto.setId(p.getId()); dto.setName(p.getName()); dto.setDescription(p.getDescription());
            dto.setPrice(p.getPrice()); dto.setUnit(p.getUnit()); dto.setStock(p.getStock());
            dto.setImageUrl(p.getImageUrl()); dto.setVisible(p.getVisible());
            if (p.getCategory() != null) { dto.setCategoryId(p.getCategory().getId()); dto.setCategoryName(p.getCategory().getName()); }
            if (p.getFarmer() != null) { dto.setFarmerId(p.getFarmer().getId()); dto.setFarmerName(p.getFarmer().getName()); dto.setFarmerLocation(p.getFarmer().getLocation()); }
            return dto;
        }).collect(Collectors.toList()));
    }

    @PutMapping("/products/{id}/visibility")
    public ResponseEntity<MessageResponse> updateVisibility(@PathVariable Long id, @RequestParam boolean visible) {
        Product p = productRepository.findById(id).orElseThrow();
        p.setVisible(visible);
        productRepository.save(p);
        return ResponseEntity.ok(new MessageResponse("Visibility updated"));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<MessageResponse> deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);
        return ResponseEntity.ok(new MessageResponse("Product deleted"));
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getUsers() {
        return ResponseEntity.ok(userRepository.findAll().stream().map(u -> {
            UserDTO dto = new UserDTO();
            dto.setId(u.getId()); dto.setName(u.getName()); dto.setEmail(u.getEmail());
            dto.setPhone(u.getPhone()); dto.setLocation(u.getLocation()); dto.setRole(u.getRole());
            return dto;
        }).collect(Collectors.toList()));
    }

    @GetMapping("/orders")
    public ResponseEntity<List<AdminOrderDTO>> getAllOrders() {
        return ResponseEntity.ok(orderRepository.findAll().stream().map(o -> {
            AdminOrderDTO dto = new AdminOrderDTO();
            dto.setId(o.getId()); dto.setCustomerName(o.getCustomer().getName());
            dto.setAddress(o.getAddress()); dto.setTotalAmount(o.getTotalAmount()); dto.setCreatedAt(o.getCreatedAt());
            dto.setItems(orderItemRepository.findByOrderId(o.getId()).stream().map(i -> {
                CustomerOrderItemDTO idto = new CustomerOrderItemDTO();
                idto.setProductName(i.getProduct().getName()); idto.setQuantity(i.getQuantity());
                idto.setPrice(i.getPrice()); idto.setStatus(i.getStatus()); idto.setFarmerName(i.getFarmer().getName());
                return idto;
            }).collect(Collectors.toList()));
            return dto;
        }).collect(Collectors.toList()));
    }
}
