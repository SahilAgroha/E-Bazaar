package com.sheoran.controller;

import com.sheoran.domain.AccountStatus;
import com.sheoran.exceptions.SellerException;
import com.sheoran.model.Seller;
import com.sheoran.model.SellerReport;
import com.sheoran.model.VerificationCode;
import com.sheoran.repository.VerificationCodeRepo;
import com.sheoran.request.LoginRequest;
import com.sheoran.response.AuthResponse;
import com.sheoran.service.AuthService;
import com.sheoran.service.EmailService;
import com.sheoran.service.SellerReportService;
import com.sheoran.service.SellerService;
import com.sheoran.utils.OtpUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping("/sellers")
public class SellerController {

    @Autowired
    private SellerService sellerService;
    @Autowired
    private VerificationCodeRepo verificationCodeRepo;
    @Autowired
    private AuthService authService;
    @Autowired
    private EmailService emailService;
    @Autowired
    private SellerReportService sellerReportService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginSeller(@RequestBody LoginRequest req) throws Exception {
        String email = req.getEmail();
        req.setEmail("seller_" + email);
        AuthResponse authResponse = authService.signing(req);
        return ResponseEntity.ok(authResponse);
    }

    @PatchMapping("/verify/{otp}")
    public ResponseEntity<Seller> verifySellerEmail(@PathVariable String otp) throws Exception {
        VerificationCode verificationCode = verificationCodeRepo.findByOtp(otp);
        if (verificationCode == null || !verificationCode.getOtp().equals(otp)) {
            throw new Exception("wrong otp .....");
        }
        Seller seller = sellerService.verifyEmail(verificationCode.getEmail(), otp);
        return new ResponseEntity<>(seller, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Seller> createSeller(@RequestBody Seller seller) throws Exception {
        Seller savedSeller = sellerService.createSeller(seller);
        String otp = OtpUtil.generateOtp();

        VerificationCode verificationCode = new VerificationCode();
        verificationCode.setOtp(otp);
        verificationCode.setEmail(seller.getEmail());
        verificationCodeRepo.save(verificationCode);

        String subject = "Welcome to buyBaazar - Verify Your Seller Account";
        String frontend_url = "http://localhost:5173/verify-seller/" + otp;

        // Styled HTML Template for Seller Registration
        String htmlContent = "<html>" +
                "<body style='font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px;'>" +
                "<div style='max-width: 600px; margin: auto; background: #ffffff; padding: 40px; border-radius: 12px; border: 1px solid #e5e7eb;'>" +
                "<div style='text-align: center; margin-bottom: 20px;'>" +
                "<h1 style='color: #4f46e5; margin: 0;'>buyBaazar Sellers</h1>" +
                "</div>" +
                "<h2 style='color: #111827; text-align: center;'>Welcome to the Marketplace!</h2>" +
                "<p style='color: #4b5563; font-size: 16px; line-height: 1.6;'>Hi " + seller.getSellerName() + ",</p>" +
                "<p style='color: #4b5563; font-size: 16px; line-height: 1.6;'>We're excited to have you on board. To start listing your products and reaching thousands of customers, please verify your email address by clicking the button below:</p>" +
                "<div style='text-align: center; margin: 35px 0;'>" +
                "<a href='" + frontend_url + "' style='background-color: #4f46e5; color: white; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 6px; font-size: 16px;'>Verify My Account</a>" +
                "</div>" +
                "<p style='color: #4b5563; font-size: 14px;'>Alternatively, you can use your verification OTP directly: <b style='color: #111827;'>" + otp + "</b></p>" +
                "<hr style='border: none; border-top: 1px solid #f3f4f6; margin: 30px 0;'>" +
                "<p style='color: #9ca3af; font-size: 12px; text-align: center;'>If you did not create an account with buyBaazar, please ignore this email.</p>" +
                "</div>" +
                "</body>" +
                "</html>";

        emailService.sendVerificationOtpEmail(seller.getEmail(), otp, subject, htmlContent);

        return new ResponseEntity<>(savedSeller, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Seller> getSellerById(@PathVariable Long id) throws SellerException {
        Seller seller = sellerService.getSellerById(id);
        return new ResponseEntity<>(seller, HttpStatus.OK);
    }

    @GetMapping("/profile")
    public ResponseEntity<Seller> getSellerByJwt(@RequestHeader("Authorization") String jwt) throws Exception {
        Seller seller = sellerService.getSellerProfile(jwt);
        return new ResponseEntity<>(seller, HttpStatus.OK);
    }

    @GetMapping("/report")
    public ResponseEntity<SellerReport> getSellerReport(@RequestHeader("Authorization") String jwt) throws Exception {
        Seller seller = sellerService.getSellerProfile(jwt);
        SellerReport sellerReport = sellerReportService.getSellerReport(seller);
        return new ResponseEntity<>(sellerReport, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<Seller>> getAllSellers(@RequestParam(required = false) AccountStatus status) {
        List<Seller> sellers = sellerService.getAllSellers(status);
        return new ResponseEntity<>(sellers, HttpStatus.OK);
    }

    @PatchMapping
    public ResponseEntity<Seller> updateSeller(@RequestHeader("Authorization") String jwt, @RequestBody Seller seller) throws Exception {
        Seller profile = sellerService.getSellerProfile(jwt);
        Seller updateSeller = sellerService.updateSeller(profile.getId(), seller);
        return new ResponseEntity<>(updateSeller, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSeller(@PathVariable Long id) throws Exception {
        sellerService.deleteSeller(id);
        return ResponseEntity.noContent().build();
    }
}