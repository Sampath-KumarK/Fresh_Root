package com.freshroots.model;
import jakarta.persistence.*;
import lombok.Data;
@Data
@Entity
@Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Column(unique = true)
    private String email;
    private String password;
    private String phone;
    private String location;
    @Enumerated(EnumType.STRING)
    private Role role;
}
