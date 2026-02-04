package com.sheoran.controller;

import com.razorpay.PaymentLink;
import com.sheoran.domain.PaymentMethod;
import com.sheoran.model.*;
import com.sheoran.repository.PaymentOrderRepo;
import com.sheoran.response.PaymentLinkResponse;
import com.sheoran.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;
    @Autowired
    private UserService userService;
    @Autowired
    private CartService cartService;
    @Autowired
    private SellerService sellerService;
    @Autowired
    private SellerReportService sellerReportService;
    @Autowired
    private PaymentService paymentService;
    @Autowired
    private PaymentOrderRepo paymentOrderRepo;

    @PostMapping()
    public ResponseEntity<PaymentLinkResponse> createOrderHandler(@RequestBody Address shippingAddress,
                                                                  @RequestParam PaymentMethod paymentMethod,
                                                                  @RequestHeader("Authorization") String jwt) throws Exception {
        User user=userService.findUserByJwtToken(jwt);
        Cart cart=cartService.findUserCart(user);
        Set<Order> orders=orderService.createOrder(user,shippingAddress,cart);

        PaymentOrder paymentOrder=paymentService.createOrder(user,orders);

        PaymentLinkResponse response=new PaymentLinkResponse();

        if (paymentMethod.equals(PaymentMethod.RAZORPAY)){
            PaymentLink payment=paymentService.createRazorpayPaymentLink(user,paymentOrder.getAmount(),paymentOrder.getId());

            String paymentUrl=payment.get("short_url");
            String paymentUrlId=payment.get("id");

            response.setPayment_link_url(paymentUrl);
            response.setPayment_link_id(paymentUrlId);
            paymentOrderRepo.save(paymentOrder);
        } else {
            String paymentUrl=paymentService.createStripePaymentLink(user,paymentOrder.getAmount(),paymentOrder.getId());
            response.setPayment_link_url(paymentUrl);
        }
        return new ResponseEntity<>(response,HttpStatus.OK);

    }

    @GetMapping("/user")
    private ResponseEntity<List<Order>> userOrderHistoryHandler(@RequestHeader("Authorization") String jwt) throws Exception {
        User user=userService.findUserByJwtToken(jwt);
        List<Order> orders=orderService.usersOrderHistory(user.getId());
        return new ResponseEntity<>(orders,HttpStatus.ACCEPTED);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long orderId,@RequestHeader("Authorization") String jwt) throws Exception {
        User user=userService.findUserByJwtToken(jwt);
        Order order=orderService.findOrderById(orderId);
        return new ResponseEntity<>(order,HttpStatus.ACCEPTED);
    }

    @GetMapping("/item/{orderItemId}")
    public ResponseEntity<OrderItem> getOrderItemById(@PathVariable Long orderId,@RequestHeader("Authorization") String jwt) throws Exception {
        User user=userService.findUserByJwtToken(jwt);
        OrderItem orderItem=orderService.getOrderItemById(orderId);
        return new ResponseEntity<>(orderItem,HttpStatus.ACCEPTED);
    }

    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<Order> cancelOrder(@PathVariable Long orderId,@RequestHeader("Authorization") String jwt) throws Exception {
        User user=userService.findUserByJwtToken(jwt);
        Order order=orderService.cancelOrder(orderId,user);

        Seller seller=sellerService.getSellerById(order.getSellerId());
        SellerReport report=sellerReportService.getSellerReport(seller);

        report.setCancelOrders(report.getCancelOrders()+1);
        report.setTotalRefunds(report.getTotalRefunds()+order.getTotalSellingPrice());
        sellerReportService.updateSellerReport(report);

        return new ResponseEntity<>(order,HttpStatus.OK);
    }
}
