package com.freshroots.service;

import com.freshroots.dto.Dtos.*;
import com.freshroots.model.*;
import com.freshroots.repository.*;
import com.freshroots.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerService {
    @Autowired OrderRepository orderRepository;
    @Autowired OrderItemRepository orderItemRepository;
    @Autowired ProductRepository productRepository;
    @Autowired UserRepository userRepository;

    @Transactional
    public MessageResponse placeOrder(CustomUserDetails userDetails, OrderRequest req) {
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
        
        return new MessageResponse("Order placed successfully");
    }

    public List<CustomerOrderDTO> getMyOrders(CustomUserDetails userDetails) {
        List<Order> orders = orderRepository.findByCustomerIdOrderByCreatedAtDesc(userDetails.getId());
        return orders.stream().map(o -> {
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
        }).collect(Collectors.toList());
    }
}
