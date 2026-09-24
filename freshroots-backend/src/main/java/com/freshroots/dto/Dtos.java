package com.freshroots.dto;
import com.freshroots.model.OrderStatus;
import com.freshroots.model.Role;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
public class Dtos {
    @Data public static class RegisterRequest {
        private String name; private String email; private String password;
        private String phone; private String location; private Role role;
    }
    @Data public static class LoginRequest {
        private String email; private String password; private Role role;
    }
    @Data public static class LoginResponse {
        private String token; private Long id; private String name;
        private String email; private Role role;
        public LoginResponse(String token, Long id, String name, String email, Role role) {
            this.token=token; this.id=id; this.name=name; this.email=email; this.role=role;
        }
    }
    @Data public static class MessageResponse {
        private String message;
        public MessageResponse(String message) { this.message = message; }
    }
    @Data public static class CategoryDTO {
        private Long id; private String name;
        public CategoryDTO(Long id, String name) { this.id=id; this.name=name; }
    }
    @Data public static class ProductDTO {
        private Long id; private String name; private String description; private Double price;
        private String unit; private Integer stock; private String imageUrl;
        private Long categoryId; private String categoryName;
        private Long farmerId; private String farmerName; private String farmerLocation;
        private Boolean visible;
    }
    @Data public static class FarmerProductRequest {
        private String name; private String description; private Double price;
        private String unit; private Integer stock; private String imageUrl; private Long categoryId;
    }
    @Data public static class OrderItemRequest {
        private Long productId; private Integer quantity;
    }
    @Data public static class OrderRequest {
        private String address; private List<OrderItemRequest> items;
    }
    @Data public static class CustomerOrderItemDTO {
        private String productName; private Integer quantity; private Double price;
        private OrderStatus status; private String farmerName;
    }
    @Data public static class CustomerOrderDTO {
        private Long orderId; private LocalDateTime createdAt; private Double totalAmount;
        private String address; private List<CustomerOrderItemDTO> items;
    }
    @Data public static class FarmerOrderItemDTO {
        private Long orderItemId; private Long orderId; private String productName;
        private Integer quantity; private Double price; private OrderStatus status;
        private String customerName; private String customerPhone; private String address;
        private LocalDateTime createdAt;
    }
    @Data public static class OrderItemStatusRequest {
        private OrderStatus status;
    }
    @Data public static class AdminStatsDTO {
        private long totalFarmers; private long totalCustomers; private long totalProducts; private long totalOrders;
        public AdminStatsDTO(long f, long c, long p, long o) {
            this.totalFarmers=f; this.totalCustomers=c; this.totalProducts=p; this.totalOrders=o;
        }
    }
    @Data public static class UserDTO {
        private Long id; private String name; private String email; private String phone;
        private String location; private Role role;
    }
    @Data public static class AdminOrderDTO {
        private Long id; private String customerName; private String address; private Double totalAmount;
        private LocalDateTime createdAt; private List<CustomerOrderItemDTO> items;
    }
}
