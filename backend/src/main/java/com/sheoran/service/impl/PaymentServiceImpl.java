package com.sheoran.service.impl;

import com.razorpay.Payment;
import com.razorpay.PaymentLink;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.sheoran.domain.PaymentOrderStatus;
import com.sheoran.domain.PaymentStatus;
import com.sheoran.model.Order;
import com.sheoran.model.PaymentOrder;
import com.sheoran.model.User;
import com.sheoran.repository.OrderRepo;
import com.sheoran.repository.PaymentOrderRepo;
import com.sheoran.service.PaymentService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Set;

@Service
//@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {
    @Autowired
    private PaymentOrderRepo paymentOrderRepo;
    @Autowired
    private OrderRepo orderRepo;

    @Value("${app.cors.allowed-origins}")
    private String allowedOrigins;

    @Value("${app.razorpay.api-key}")
    private String apiKey;

    @Value("${app.razorpay.api-secret}")
    private String apiSecret;

    @Value("${app.stripe.secret-key}")
    private String stripeSecretKey;

    @Override
    public PaymentOrder createOrder(User user, Set<Order> orders) {

        BigDecimal amount = orders.stream()
                .map(Order::getTotalSellingPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        PaymentOrder paymentOrder = new PaymentOrder();
        paymentOrder.setAmount(amount);
        paymentOrder.setUser(user);
        paymentOrder.setOrders(orders);
        paymentOrder.setStatus(PaymentOrderStatus.PENDING);

        return paymentOrderRepo.save(paymentOrder);
    }

    @Override
    public PaymentOrder getPaymentOrderById(Long orderId) throws Exception {
        return paymentOrderRepo.findById(orderId)
                .orElseThrow(() -> new Exception("Payment order not found"));
    }

    @Override
    public PaymentOrder getPaymentOrderByPaymentId(String paymentLinkId) throws Exception {

        PaymentOrder paymentOrder =
                paymentOrderRepo.findByPaymentLinkId(paymentLinkId);

        if (paymentOrder == null) {
            throw new Exception("Payment order not found");
        }

        return paymentOrder;
    }

    @Override
    public Boolean proceedPaymentOrder(
            PaymentOrder paymentOrder,
            String paymentId,
            String paymentLinkId
    ) throws RazorpayException {

        if (!paymentOrder.getStatus().equals(PaymentOrderStatus.PENDING)) {
            return false;
        }

        RazorpayClient razorpayClient =
                new RazorpayClient(apiKey, apiSecret);

        Payment payment = razorpayClient.payments.fetch(paymentId);

        String status = payment.get("status");

        if ("captured".equals(status)) {

            for (Order order : paymentOrder.getOrders()) {
                order.setPaymentStatus(PaymentStatus.COMPLETED);
                orderRepo.save(order);
            }

            paymentOrder.setStatus(PaymentOrderStatus.SUCCESS);
            paymentOrderRepo.save(paymentOrder);

            return true;
        }

        paymentOrder.setStatus(PaymentOrderStatus.FAILED);
        paymentOrderRepo.save(paymentOrder);

        return false;
    }

    @Override
    public PaymentLink createRazorpayPaymentLink(
            User user,
            BigDecimal amount,
            Long orderId
    ) throws RazorpayException {

        RazorpayClient razorpayClient =
                new RazorpayClient(apiKey, apiSecret);

        // Convert INR to paisa
        long amountInPaisa = amount
                .multiply(BigDecimal.valueOf(100))
                .setScale(0, RoundingMode.HALF_UP)
                .longValue();

        JSONObject paymentLinkRequest = new JSONObject();
        paymentLinkRequest.put("amount", amountInPaisa);
        paymentLinkRequest.put("currency", "INR");

        JSONObject customer = new JSONObject();
        customer.put("name", user.getFullName());
        customer.put("email", user.getEmail());

        paymentLinkRequest.put("customer", customer);

        paymentLinkRequest.put(
                "callback_url",
                allowedOrigins + "/payment-success/" + orderId
        );

        paymentLinkRequest.put("callback_method", "get");

        return razorpayClient.paymentLink.create(paymentLinkRequest);
    }

    @Override
    public String createStripePaymentLink(
            User user,
            BigDecimal amount,
            Long orderId
    ) throws StripeException {

        Stripe.apiKey = stripeSecretKey;

        long amountInCents = amount
                .multiply(BigDecimal.valueOf(100))
                .setScale(0, RoundingMode.HALF_UP)
                .longValue();

        SessionCreateParams params =
                SessionCreateParams.builder()
                        .addPaymentMethodType(
                                SessionCreateParams.PaymentMethodType.CARD
                        )
                        .setMode(SessionCreateParams.Mode.PAYMENT)
                        .setSuccessUrl(
                                allowedOrigins + "/payment-success/" + orderId
                        )
                        .setCancelUrl(
                                allowedOrigins + "/payment-cancel/"
                        )
                        .addLineItem(
                                SessionCreateParams.LineItem.builder()
                                        .setQuantity(1L)
                                        .setPriceData(
                                                SessionCreateParams.LineItem
                                                        .PriceData.builder()
                                                        .setCurrency("usd")
                                                        .setUnitAmount(amountInCents)
                                                        .setProductData(
                                                                SessionCreateParams.LineItem
                                                                        .PriceData.ProductData
                                                                        .builder()
                                                                        .setName("BuyBaazar Payment")
                                                                        .build()
                                                        )
                                                        .build()
                                        )
                                        .build()
                        )
                        .build();

        Session session = Session.create(params);

        return session.getUrl();
    }
}