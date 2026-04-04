package com.sheoran.service.impl;

import com.sheoran.domain.OrderStatus;
import com.sheoran.domain.PaymentStatus;
import com.sheoran.model.*;
import com.sheoran.repository.AddressRepo;
import com.sheoran.repository.OrderItemRepo;
import com.sheoran.repository.OrderRepo;
import com.sheoran.repository.UserRepo;
import com.sheoran.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
//@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    @Autowired
    private OrderRepo orderRepo;
    @Autowired
    private AddressRepo addressRepo;
    @Autowired
    private OrderItemRepo orderItemRepo;
    @Autowired
    private UserRepo userRepo;

    @Override
    public Set<Order> createOrder(User user, Address shippingAddress, Cart cart) {

//        if (!user.getAddresses().contains(shippingAddress)) {
//            user.getAddresses().add(shippingAddress);
//        }

        Address savedAddress;

        if (shippingAddress.getId() != null) {
            // Existing address → fetch from DB
            savedAddress = addressRepo.findById(shippingAddress.getId())
                    .orElseThrow(() -> new RuntimeException("Address not found"));
        } else {
            // New address → save
            savedAddress = addressRepo.save(shippingAddress);
            user.getAddresses().add(savedAddress);
            userRepo.save(user);
        }

        Map<Long, List<CartItem>> itemsBySeller =
                cart.getCartItems().stream()
                        .collect(Collectors.groupingBy(
                                item -> item.getProduct().getSeller().getId()
                        ));

        Set<Order> orders = new HashSet<>();

        for (Map.Entry<Long, List<CartItem>> entry : itemsBySeller.entrySet()) {

            Long sellerId = entry.getKey();
            List<CartItem> items = entry.getValue();

            BigDecimal totalSellingPrice = BigDecimal.ZERO;
            BigDecimal totalMrpPrice = BigDecimal.ZERO;
            int totalItems = 0;

            for (CartItem item : items) {
                totalSellingPrice =
                        totalSellingPrice.add(item.getSellingPrice());

                totalMrpPrice =
                        totalMrpPrice.add(item.getMrpPrice());

                totalItems += item.getQuantity();
            }

            Order order = new Order();
            order.setUser(user);
            order.setSellerId(sellerId);
            order.setShippingAddress(savedAddress);
            order.setOrderStatus(OrderStatus.PENDING);
            order.setPaymentStatus(PaymentStatus.PENDING);

            order.setTotalSellingPrice(totalSellingPrice);
            order.setTotalMrpPrice(totalMrpPrice);
            order.setTotalItems(totalItems);
            order.setDiscount(totalMrpPrice.subtract(totalSellingPrice));

            order.setOrderId(UUID.randomUUID().toString());

            Order savedOrder = orderRepo.save(order);

            for (CartItem item : items) {

                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(savedOrder);
                orderItem.setProduct(item.getProduct());
                orderItem.setQuantity(item.getQuantity());
                orderItem.setSize(item.getSize());
                orderItem.setMrpPrice(item.getMrpPrice());
                orderItem.setSellingPrice(item.getSellingPrice());

                orderItemRepo.save(orderItem);
            }

            orders.add(savedOrder);
        }

        return orders;
    }

    @Override
    public Order findOrderById(Long id) throws Exception {
        return orderRepo.findById(id)
                .orElseThrow(() -> new Exception("Order not found"));
    }

    @Override
    public List<Order> usersOrderHistory(Long userId) {
        return orderRepo.findByUserId(userId);
    }

    @Override
    public List<Order> sellerOrder(Long sellerId) {
        return orderRepo.findBySellerId(sellerId);
    }

    @Override
    public Order updateOrderStatus(Long orderId, OrderStatus orderStatus)
            throws Exception {

        Order order = findOrderById(orderId);
        order.setOrderStatus(orderStatus);
        return orderRepo.save(order);
    }

    @Override
    public Order cancelOrder(Long orderId, User user) throws Exception {

        Order order = findOrderById(orderId);

        if (!user.getId().equals(order.getUser().getId())) {
            throw new Exception("You don't have access to this order");
        }

        order.setOrderStatus(OrderStatus.CANCELLED);
        return orderRepo.save(order);
    }

    @Override
    public OrderItem getOrderItemById(Long id) throws Exception {
        return orderItemRepo.findById(id)
                .orElseThrow(() -> new Exception("Order item not found"));
    }
}