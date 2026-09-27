package com.freshroots.controller;
import com.freshroots.dto.Dtos.*;
import com.freshroots.security.CustomUserDetails;
import com.freshroots.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/customer")
public class CustomerController {
    @Autowired
    private CustomerService customerService;

    @PostMapping("/orders")
    public ResponseEntity<MessageResponse> placeOrder(@AuthenticationPrincipal CustomUserDetails userDetails, @RequestBody OrderRequest req) {
        return ResponseEntity.ok(customerService.placeOrder(userDetails, req));
    }

    @GetMapping("/orders")
    public ResponseEntity<List<CustomerOrderDTO>> getMyOrders(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(customerService.getMyOrders(userDetails));
    }
}
