package com.sheoran.service;

import com.razorpay.PaymentLink;
import com.razorpay.RazorpayException;
import com.sheoran.domain.PaymentMethod;
import com.sheoran.model.Order;
import com.sheoran.model.PaymentOrder;
import com.sheoran.model.User;
import com.stripe.exception.StripeException;

import java.math.BigDecimal;
import java.util.Set;

public interface PaymentService {

//    PaymentOrder createOrder(User user, Set<Order> orders);

    PaymentOrder createOrder(User user, Set<Order> orders, PaymentMethod paymentMethod);

    PaymentOrder getPaymentOrderById(Long orderId) throws Exception;
    PaymentOrder getPaymentOrderByPaymentId(String orderId) throws Exception;
    Boolean proceedPaymentOrder(PaymentOrder paymentOrder,String paymentId,String paymentLinkId) throws RazorpayException;
    PaymentLink createRazorpayPaymentLink(User user, BigDecimal amount, Long orderId) throws RazorpayException;
    String createStripePaymentLink(User user,BigDecimal amount,Long orderId) throws StripeException;
}
