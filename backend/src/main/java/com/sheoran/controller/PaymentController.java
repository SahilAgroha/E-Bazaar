package com.sheoran.controller;

import com.sheoran.model.*;
import com.sheoran.response.ApiResponse;
import com.sheoran.response.PaymentLinkResponse;
import com.sheoran.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;
    @Autowired
    private UserService userService;
    @Autowired
    private SellerService sellerService;
    @Autowired
    private OrderService orderService;
    @Autowired
    private SellerReportService sellerReportService;
    @Autowired
    private TransactionService transactionService;

    @GetMapping("/{paymentId}")
    public ResponseEntity<ApiResponse> paymentSuccessHandler(@PathVariable String paymentId,
                                                             @RequestParam String paymentLinkId,
                                                             @RequestHeader("Authorization") String jwt) throws Exception {
        User user=userService.findUserByJwtToken(jwt);

        PaymentLinkResponse paymentLinkResponse;
        PaymentOrder paymentOrder=paymentService.getPaymentOrderByPaymentId(paymentLinkId);

        boolean paymentSuccess=paymentService.proceedPaymentOrder(paymentOrder,paymentId,paymentLinkId);

        if (paymentSuccess){
            for (Order order:paymentOrder.getOrders()){
                Seller seller=sellerService.getSellerById(order.getSellerId());
                transactionService.createTransaction(order);
                SellerReport report=sellerReportService.getSellerReport(seller);
                report.setTotalOrders(report.getTotalOrders()+1);
                report.setTotalEarning(report.getTotalEarning()+order.getTotalSellingPrice());
                report.setTotalSales(report.getTotalSales()+order.getOrderItems().size());
                sellerReportService.updateSellerReport(report);
            }

        }
        ApiResponse response=new ApiResponse();
        response.setMessage("Payment successful");
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }


}
