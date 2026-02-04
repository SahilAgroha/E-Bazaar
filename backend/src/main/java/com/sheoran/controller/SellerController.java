package com.sheoran.controller;

import com.sheoran.config.JwtProvider;
import com.sheoran.domain.AccountStatus;
import com.sheoran.exceptions.SellerException;
import com.sheoran.model.Seller;
import com.sheoran.model.SellerReport;
import com.sheoran.model.VerificationCode;
import com.sheoran.repository.SellerReportRepo;
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
        String otp=req.getOtp();
        String email= req.getEmail();

        req.setEmail("seller_"+email);
        AuthResponse authResponse=authService.signing(req);

        return ResponseEntity.ok(authResponse);
    }

    @PatchMapping("/verify/{otp}")
    public ResponseEntity<Seller> verifySellerEmail(@PathVariable String otp ) throws Exception{
        VerificationCode verificationCode=verificationCodeRepo.findByOtp(otp);
        if (verificationCode==null || !verificationCode.getOtp().equals(otp)){
            throw new Exception("wrong otp .....");
        }
        Seller seller=sellerService.verifyEmail(verificationCode.getEmail(), otp);
        return new ResponseEntity<>(seller, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Seller> createSeller(@RequestBody Seller seller ) throws Exception {
        Seller savedSeller=sellerService.createSeller(seller);
        String otp= OtpUtil.generateOtp();

        VerificationCode verificationCode=new VerificationCode();
        verificationCode.setOtp(otp);
        verificationCode.setEmail(seller.getEmail());
        verificationCodeRepo.save(verificationCode);

        String subject="BuyBaazar Email verification code";
        String text="Welcome to BuyBaazar , verify your account using this link ";
        String frontend_url="http://localhost:5173/verify-seller/";
        emailService.sendVerificationOtpEmail(seller.getEmail(), verificationCode.getOtp(),subject,text+frontend_url);
        return new ResponseEntity<>(savedSeller,HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Seller> getSellerById(@PathVariable Long id) throws SellerException {
        Seller seller=sellerService.getSellerById(id);
        return new ResponseEntity<>(seller,HttpStatus.OK);
    }

    @GetMapping("/profile")
    public ResponseEntity<Seller> getSellerByJwt(@RequestHeader("Authorization") String jwt) throws Exception {
        Seller seller=sellerService.getSellerProfile(jwt);
        return new ResponseEntity<>(seller,HttpStatus.OK);
    }

    @GetMapping("/report")
    public ResponseEntity<SellerReport> getSellerReport(@RequestHeader("Authorization") String jwt) throws Exception {
        Seller seller=sellerService.getSellerProfile(jwt);
        SellerReport sellerReport=sellerReportService.getSellerReport(seller);
        return new ResponseEntity<>(sellerReport,HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<Seller>> getAllSellers(@RequestParam(required = false) AccountStatus status){
        List<Seller> sellers=sellerService.getAllSellers(status);
        return new ResponseEntity<>(sellers,HttpStatus.OK);
    }

    @PatchMapping
    public ResponseEntity<Seller> updateSeller(@RequestHeader("Authorization") String jwt, @RequestBody Seller seller) throws Exception {
        Seller profile=sellerService.getSellerProfile(jwt);
        Seller updateSeller=sellerService.updateSeller(profile.getId(), seller);
        return new ResponseEntity<>(updateSeller,HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSeller(@PathVariable Long id) throws Exception {
        sellerService.deleteSeller(id);
        return ResponseEntity.noContent().build();
    }

}
