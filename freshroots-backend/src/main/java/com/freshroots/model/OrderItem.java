package com.freshroots.model;
import jakarta.persistence.*;
import lombok.Data;
@Data
@Entity
public class OrderItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    private Order order;
    @ManyToOne
    private Product product;
    @ManyToOne
    private User farmer;
    private Integer quantity;
    private Double price;
    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.PLACED;
}
