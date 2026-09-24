package com.freshroots.model;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
@Data
@Entity
@Table(name = "orders")
public class Order {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    private User customer;
    private String address;
    private Double totalAmount;
    private LocalDateTime createdAt = LocalDateTime.now();
}
