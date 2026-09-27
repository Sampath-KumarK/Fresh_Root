package com.freshroots.controller;
import com.freshroots.dto.Dtos.*;
import com.freshroots.security.CustomUserDetails;
import com.freshroots.service.FarmerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/farmer")
public class FarmerController {
    @Autowired
    private FarmerService farmerService;

    @GetMapping("/products")
    public ResponseEntity<List<ProductDTO>> getFarmerProducts(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(farmerService.getFarmerProducts(user));
    }

    @PostMapping("/products")
    public ResponseEntity<MessageResponse> addProduct(@AuthenticationPrincipal CustomUserDetails user, @RequestBody FarmerProductRequest req) {
        return ResponseEntity.ok(farmerService.addProduct(user, req));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<MessageResponse> updateProduct(@AuthenticationPrincipal CustomUserDetails user, @PathVariable Long id, @RequestBody FarmerProductRequest req) {
        return ResponseEntity.ok(farmerService.updateProduct(user, id, req));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<MessageResponse> deleteProduct(@AuthenticationPrincipal CustomUserDetails user, @PathVariable Long id) {
        return ResponseEntity.ok(farmerService.deleteProduct(user, id));
    }

    @GetMapping("/orders")
    public ResponseEntity<List<FarmerOrderItemDTO>> getFarmerOrders(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(farmerService.getFarmerOrders(user));
    }

    @PutMapping("/order-items/{id}/status")
    public ResponseEntity<MessageResponse> updateOrderItemStatus(@AuthenticationPrincipal CustomUserDetails user, @PathVariable Long id, @RequestBody OrderItemStatusRequest req) {
        return ResponseEntity.ok(farmerService.updateOrderItemStatus(user, id, req));
    }
}
