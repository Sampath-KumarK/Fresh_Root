package com.freshroots.repository;
import com.freshroots.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByFarmerIdOrderByOrderCreatedAtDesc(Long farmerId);
    List<OrderItem> findByOrderId(Long orderId);
}
