import os

base_dir = r"D:\Gihubproject\freshroots-backend"

def write_file(path, content):
    full_path = os.path.join(base_dir, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")

write_file("pom.xml", """
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>3.1.5</version>
		<relativePath/>
	</parent>
	<groupId>com.freshroots</groupId>
	<artifactId>freshroots-backend</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	<name>freshroots-backend</name>
	<description>Freshroots Backend</description>
	<properties>
		<java.version>17</java.version>
	</properties>
	<dependencies>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-data-jpa</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-security</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-validation</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>
		<dependency>
			<groupId>com.mysql</groupId>
			<artifactId>mysql-connector-j</artifactId>
			<scope>runtime</scope>
		</dependency>
		<dependency>
			<groupId>org.projectlombok</groupId>
			<artifactId>lombok</artifactId>
			<optional>true</optional>
		</dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>0.11.5</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>0.11.5</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>0.11.5</version>
            <scope>runtime</scope>
        </dependency>
	</dependencies>
	<build>
		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
			</plugin>
		</plugins>
	</build>
</project>
""")

write_file("src/main/resources/application.properties", """
spring.datasource.url=jdbc:mysql://localhost:3306/freshroots_db?createDatabaseIfNotExist=true&useSSL=false
spring.datasource.username=root
spring.datasource.password=root
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
server.port=8080
jwt.secret=94a08da1fecbb6e8b46990538c7b50b294a08da1fecbb6e8b46990538c7b50b294a08da1fecbb6e8b46990538c7b50b2
jwt.expiration=86400000
""")

pkg = "src/main/java/com/freshroots/"

write_file(pkg + "FreshrootsApplication.java", """
package com.freshroots;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
@SpringBootApplication
public class FreshrootsApplication {
	public static void main(String[] args) {
		SpringApplication.run(FreshrootsApplication.class, args);
	}
}
""")

write_file(pkg + "model/Role.java", """
package com.freshroots.model;
public enum Role { FARMER, CUSTOMER, ADMIN }
""")

write_file(pkg + "model/OrderStatus.java", """
package com.freshroots.model;
public enum OrderStatus { PLACED, CONFIRMED, DELIVERED, CANCELLED }
""")

write_file(pkg + "model/User.java", """
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
""")

write_file(pkg + "model/Category.java", """
package com.freshroots.model;
import jakarta.persistence.*;
import lombok.Data;
@Data
@Entity
public class Category {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    public Category() {}
    public Category(String name) { this.name = name; }
}
""")

write_file(pkg + "model/Product.java", """
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
""")

write_file(pkg + "model/Order.java", """
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
""")

write_file(pkg + "model/OrderItem.java", """
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
""")

write_file(pkg + "repository/UserRepository.java", """
package com.freshroots.repository;
import com.freshroots.model.User;
import com.freshroots.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    long countByRole(Role role);
}
""")

write_file(pkg + "repository/CategoryRepository.java", """
package com.freshroots.repository;
import com.freshroots.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
public interface CategoryRepository extends JpaRepository<Category, Long> {}
""")

write_file(pkg + "repository/ProductRepository.java", """
package com.freshroots.repository;
import com.freshroots.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByFarmerId(Long farmerId);
    
    @Query("SELECT p FROM Product p WHERE p.visible = true AND p.stock > 0 " +
           "AND (:categoryId IS NULL OR p.category.id = :categoryId) " +
           "AND (:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%',:search,'%')))")
    List<Product> findPublicProducts(@Param("categoryId") Long categoryId, @Param("search") String search);
}
""")

write_file(pkg + "repository/OrderRepository.java", """
package com.freshroots.repository;
import com.freshroots.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
}
""")

write_file(pkg + "repository/OrderItemRepository.java", """
package com.freshroots.repository;
import com.freshroots.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByFarmerIdOrderByOrderCreatedAtDesc(Long farmerId);
    List<OrderItem> findByOrderId(Long orderId);
}
""")

write_file(pkg + "security/JwtUtils.java", """
package com.freshroots.security;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;
import java.util.Base64;
@Component
public class JwtUtils {
    @Value("${jwt.secret}")
    private String jwtSecret;
    @Value("${jwt.expiration}")
    private int jwtExpirationMs;

    private Key key() {
        return Keys.hmacShaKeyFor(Base64.getDecoder().decode(Base64.getEncoder().encodeToString(jwtSecret.getBytes())));
    }

    public String generateJwtToken(Authentication authentication) {
        CustomUserDetails userPrincipal = (CustomUserDetails) authentication.getPrincipal();
        return Jwts.builder()
                .setSubject((userPrincipal.getUsername()))
                .claim("role", userPrincipal.getRole().name())
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String getUserNameFromJwtToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key()).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(authToken);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
""")

write_file(pkg + "security/CustomUserDetails.java", """
package com.freshroots.security;
import com.freshroots.model.User;
import com.freshroots.model.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.Collections;
@AllArgsConstructor
public class CustomUserDetails implements UserDetails {
    @Getter private Long id;
    private String email;
    private String password;
    @Getter private Role role;
    private Collection<? extends GrantedAuthority> authorities;

    public static CustomUserDetails build(User user) {
        GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getRole().name());
        return new CustomUserDetails(
                user.getId(),
                user.getEmail(),
                user.getPassword(),
                user.getRole(),
                Collections.singletonList(authority));
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() { return authorities; }
    @Override
    public String getPassword() { return password; }
    @Override
    public String getUsername() { return email; }
    @Override
    public boolean isAccountNonExpired() { return true; }
    @Override
    public boolean isAccountNonLocked() { return true; }
    @Override
    public boolean isCredentialsNonExpired() { return true; }
    @Override
    public boolean isEnabled() { return true; }
}
""")

write_file(pkg + "security/CustomUserDetailsService.java", """
package com.freshroots.security;
import com.freshroots.model.User;
import com.freshroots.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired
    UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with email: " + email));
        return CustomUserDetails.build(user);
    }
}
""")

write_file(pkg + "security/JwtAuthenticationFilter.java", """
package com.freshroots.security;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Autowired private JwtUtils jwtUtils;
    @Autowired private CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String jwt = parseJwt(request);
            if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
                String email = jwtUtils.getUserNameFromJwtToken(jwt);
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            // log error
        }
        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }
        return null;
    }
}
""")

write_file(pkg + "config/SecurityConfig.java", """
package com.freshroots.config;
import com.freshroots.security.CustomUserDetailsService;
import com.freshroots.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    @Bean
    public JwtAuthenticationFilter authenticationJwtTokenFilter() {
        return new JwtAuthenticationFilter();
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("http://localhost:5173");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, CustomUserDetailsService userDetailsService) throws Exception {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());

        http.csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> corsFilter())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> 
                auth.requestMatchers("/api/auth/**").permitAll()
                    .requestMatchers("/api/categories").permitAll()
                    .requestMatchers("/api/products/**").permitAll()
                    .requestMatchers("/api/farmer/**").hasRole("FARMER")
                    .requestMatchers("/api/customer/**").hasRole("CUSTOMER")
                    .requestMatchers("/api/admin/**").hasRole("ADMIN")
                    .anyRequest().authenticated()
            );

        http.authenticationProvider(authProvider);
        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
""")

write_file(pkg + "exception/GlobalExceptionHandler.java", """
package com.freshroots.exception;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.util.HashMap;
import java.util.Map;
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleException(Exception e) {
        Map<String, String> map = new HashMap<>();
        map.put("message", e.getMessage());
        return new ResponseEntity<>(map, HttpStatus.BAD_REQUEST);
    }
}
""")

# DTOs
write_file(pkg + "dto/Dtos.java", """
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
""")

# Controllers
write_file(pkg + "controller/AuthController.java", """
package com.freshroots.controller;
import com.freshroots.dto.Dtos.*;
import com.freshroots.model.User;
import com.freshroots.model.Role;
import com.freshroots.repository.UserRepository;
import com.freshroots.security.JwtUtils;
import com.freshroots.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired AuthenticationManager authenticationManager;
    @Autowired UserRepository userRepository;
    @Autowired PasswordEncoder encoder;
    @Autowired JwtUtils jwtUtils;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        if (request.getRole() == Role.ADMIN) {
            throw new RuntimeException("Cannot register as ADMIN");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already in use!");
        }
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(encoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setLocation(request.getLocation());
        user.setRole(request.getRole());
        userRepository.save(user);
        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        if (userDetails.getRole() != loginRequest.getRole()) {
            throw new RuntimeException("Role mismatch!");
        }
        String jwt = jwtUtils.generateJwtToken(authentication);
        return ResponseEntity.ok(new LoginResponse(jwt, userDetails.getId(), userDetails.getUsername(), userDetails.getUsername(), userDetails.getRole()));
    }
}
""")

write_file(pkg + "controller/PublicController.java", """
package com.freshroots.controller;
import com.freshroots.dto.Dtos.*;
import com.freshroots.model.Category;
import com.freshroots.model.Product;
import com.freshroots.repository.CategoryRepository;
import com.freshroots.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;
@RestController
@RequestMapping("/api")
public class PublicController {
    @Autowired CategoryRepository categoryRepository;
    @Autowired ProductRepository productRepository;

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryDTO>> getCategories() {
        return ResponseEntity.ok(categoryRepository.findAll().stream()
                .map(c -> new CategoryDTO(c.getId(), c.getName())).collect(Collectors.toList()));
    }

    @GetMapping("/products")
    public ResponseEntity<List<ProductDTO>> getProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search) {
        List<Product> products = productRepository.findPublicProducts(categoryId, search);
        return ResponseEntity.ok(products.stream().map(this::mapToDTO).collect(Collectors.toList()));
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<ProductDTO> getProduct(@PathVariable Long id) {
        Product p = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        return ResponseEntity.ok(mapToDTO(p));
    }

    private ProductDTO mapToDTO(Product p) {
        ProductDTO dto = new ProductDTO();
        dto.setId(p.getId()); dto.setName(p.getName()); dto.setDescription(p.getDescription());
        dto.setPrice(p.getPrice()); dto.setUnit(p.getUnit()); dto.setStock(p.getStock());
        dto.setImageUrl(p.getImageUrl());
        if (p.getCategory() != null) {
            dto.setCategoryId(p.getCategory().getId()); dto.setCategoryName(p.getCategory().getName());
        }
        if (p.getFarmer() != null) {
            dto.setFarmerId(p.getFarmer().getId()); dto.setFarmerName(p.getFarmer().getName());
            dto.setFarmerLocation(p.getFarmer().getLocation());
        }
        dto.setVisible(p.getVisible());
        return dto;
    }
}
""")

write_file(pkg + "controller/FarmerController.java", """
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
}
""")

write_file(pkg + "controller/CustomerController.java", """
package com.freshroots.controller;
import com.freshroots.dto.Dtos.*;
import com.freshroots.model.*;
import com.freshroots.repository.*;
import com.freshroots.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
@RestController
@RequestMapping("/api/customer")
public class CustomerController {
    @Autowired OrderRepository orderRepository;
    @Autowired OrderItemRepository orderItemRepository;
    @Autowired ProductRepository productRepository;
    @Autowired UserRepository userRepository;

    @PostMapping("/orders")
    @Transactional
    public ResponseEntity<MessageResponse> placeOrder(@AuthenticationPrincipal CustomUserDetails userDetails, @RequestBody OrderRequest req) {
        User customer = userRepository.findById(userDetails.getId()).orElseThrow();
        Order order = new Order();
        order.setCustomer(customer);
        order.setAddress(req.getAddress());
        order.setTotalAmount(0.0);
        order = orderRepository.save(order);

        double total = 0.0;
        for (OrderItemRequest reqItem : req.getItems()) {
            Product p = productRepository.findById(reqItem.getProductId()).orElseThrow();
            if (p.getStock() < reqItem.getQuantity() || !p.getVisible()) {
                throw new RuntimeException("Product " + p.getName() + " is out of stock or unavailable");
            }
            p.setStock(p.getStock() - reqItem.getQuantity());
            productRepository.save(p);

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(p);
            item.setFarmer(p.getFarmer());
            item.setQuantity(reqItem.getQuantity());
            item.setPrice(p.getPrice());
            item.setStatus(OrderStatus.PLACED);
            orderItemRepository.save(item);
            
            total += (p.getPrice() * reqItem.getQuantity());
        }
        order.setTotalAmount(total);
        orderRepository.save(order);
        
        return ResponseEntity.ok(new MessageResponse("Order placed successfully"));
    }

    @GetMapping("/orders")
    public ResponseEntity<List<CustomerOrderDTO>> getMyOrders(@AuthenticationPrincipal CustomUserDetails userDetails) {
        List<Order> orders = orderRepository.findByCustomerIdOrderByCreatedAtDesc(userDetails.getId());
        return ResponseEntity.ok(orders.stream().map(o -> {
            CustomerOrderDTO dto = new CustomerOrderDTO();
            dto.setOrderId(o.getId()); dto.setCreatedAt(o.getCreatedAt()); dto.setTotalAmount(o.getTotalAmount()); dto.setAddress(o.getAddress());
            List<OrderItem> items = orderItemRepository.findByOrderId(o.getId());
            dto.setItems(items.stream().map(i -> {
                CustomerOrderItemDTO idto = new CustomerOrderItemDTO();
                idto.setProductName(i.getProduct().getName()); idto.setQuantity(i.getQuantity());
                idto.setPrice(i.getPrice()); idto.setStatus(i.getStatus()); idto.setFarmerName(i.getFarmer().getName());
                return idto;
            }).collect(Collectors.toList()));
            return dto;
        }).collect(Collectors.toList()));
    }
}
""")

write_file(pkg + "controller/AdminController.java", """
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
""")

write_file(pkg + "seed/DataSeeder.java", """
package com.freshroots.seed;
import com.freshroots.model.*;
import com.freshroots.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
@Component
public class DataSeeder implements CommandLineRunner {
    @Autowired UserRepository userRepository;
    @Autowired CategoryRepository categoryRepository;
    @Autowired ProductRepository productRepository;
    @Autowired PasswordEncoder encoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) return;

        User admin = new User(); admin.setName("Admin"); admin.setEmail("admin@freshroots.com");
        admin.setPassword(encoder.encode("Admin@123")); admin.setRole(Role.ADMIN);
        userRepository.save(admin);

        User murugan = new User(); murugan.setName("Murugan"); murugan.setEmail("murugan@freshroots.com");
        murugan.setPassword(encoder.encode("Farmer@123")); murugan.setRole(Role.FARMER); murugan.setLocation("Pollachi");
        userRepository.save(murugan);

        User lakshmi = new User(); lakshmi.setName("Lakshmi"); lakshmi.setEmail("lakshmi@freshroots.com");
        lakshmi.setPassword(encoder.encode("Farmer@123")); lakshmi.setRole(Role.FARMER); lakshmi.setLocation("Ooty");
        userRepository.save(lakshmi);

        User selvam = new User(); selvam.setName("Selvam"); selvam.setEmail("selvam@freshroots.com");
        selvam.setPassword(encoder.encode("Farmer@123")); selvam.setRole(Role.FARMER); selvam.setLocation("Theni");
        userRepository.save(selvam);

        User priya = new User(); priya.setName("Priya"); priya.setEmail("customer@freshroots.com");
        priya.setPassword(encoder.encode("Customer@123")); priya.setRole(Role.CUSTOMER); priya.setLocation("Coimbatore");
        userRepository.save(priya);

        Category veg = categoryRepository.save(new Category("Vegetables"));
        Category fru = categoryRepository.save(new Category("Fruits"));
        Category leafy = categoryRepository.save(new Category("Leafy Greens"));
        Category root = categoryRepository.save(new Category("Roots & Tubers"));

        createProduct("Tomato", "Fresh organic tomatoes", 30.0, "kg", 50, veg, murugan);
        createProduct("Brinjal", "Purple brinjals", 40.0, "kg", 30, veg, selvam);
        createProduct("Ladies Finger (Okra)", "Tender okra", 45.0, "kg", 20, veg, murugan);
        createProduct("Butter Gourd (Bottle Gourd)", "Healthy bottle gourd", 25.0, "kg", 40, veg, lakshmi);
        createProduct("Drumstick", "Long drumsticks", 50.0, "kg", 25, veg, selvam);
        createProduct("Beans", "Crispy green beans", 60.0, "kg", 20, veg, lakshmi);

        createProduct("Mango (Banganapalli)", "Sweet mangoes", 80.0, "kg", 100, fru, murugan);
        createProduct("Banana (Poovan)", "Poovan bananas", 40.0, "dozen", 40, fru, selvam);
        createProduct("Papaya", "Ripe papaya", 30.0, "piece", 30, fru, lakshmi);
        createProduct("Guava", "Fresh green guava", 50.0, "kg", 25, fru, murugan);

        createProduct("Spinach (Keerai)", "Fresh palak/spinach", 15.0, "bunch", 50, leafy, lakshmi);
        createProduct("Coriander", "Fresh coriander leaves", 10.0, "bunch", 100, leafy, selvam);

        createProduct("Potato", "Medium sized potatoes", 35.0, "kg", 80, root, murugan);
        createProduct("Onion", "Red onions", 30.0, "kg", 100, root, lakshmi);
        createProduct("Carrot", "Ooty carrots", 60.0, "kg", 40, root, lakshmi);
    }
    
    private void createProduct(String n, String d, double p, String u, int s, Category c, User f) {
        Product pr = new Product(); pr.setName(n); pr.setDescription(d); pr.setPrice(p);
        pr.setUnit(u); pr.setStock(s); pr.setCategory(c); pr.setFarmer(f); pr.setImageUrl("");
        productRepository.save(pr);
    }
}
""")
