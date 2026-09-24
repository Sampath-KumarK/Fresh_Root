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
