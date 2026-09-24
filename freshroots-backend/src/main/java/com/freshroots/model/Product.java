package com.freshroots.model;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
@Data
@Entity
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private Double price;
    private String unit;
    private Integer stock;
    private String imageUrl;
    @ManyToOne
    private Category category;
    @ManyToOne
    private User farmer;
    private Boolean visible = true;
    private LocalDateTime createdAt = LocalDateTime.now();
}
