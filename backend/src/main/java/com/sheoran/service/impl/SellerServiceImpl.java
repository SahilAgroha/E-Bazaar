package com.sheoran.service.impl;

import com.sheoran.config.JwtProvider;
import com.sheoran.domain.AccountStatus;
import com.sheoran.domain.USER_ROLE;
import com.sheoran.exceptions.SellerException;
import com.sheoran.model.Address;
import com.sheoran.model.BankDetails;
import com.sheoran.model.BusinessDetails;
import com.sheoran.model.Seller;
import com.sheoran.repository.AddressRepo;
import com.sheoran.repository.SellerRepo;
import com.sheoran.repository.VerificationCodeRepo;
import com.sheoran.service.EmailService;
import com.sheoran.service.SellerService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SellerServiceImpl implements SellerService {

    @Autowired
    private SellerRepo sellerRepo;
    @Autowired
    private JwtProvider jwtProvider;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AddressRepo addressRepo;





    @Override
    public Seller getSellerProfile(String jwt) throws Exception {
        String email=jwtProvider.getEmailFromJwtToken(jwt);
        return this.getSellerByEmail(email);
    }

    @Override
    public Seller createSeller(Seller seller) throws Exception {
        Seller sellerExist =sellerRepo.findByEmail(seller.getEmail());
        if (sellerExist!=null){
            throw new Exception("seller already exist, use different email");
        }
        Address address=addressRepo.save(seller.getPickupAddress());

        Seller newSeller=new Seller();
        newSeller.setEmail(seller.getEmail());
        newSeller.setPassword(passwordEncoder.encode(seller.getPassword()));
        newSeller.setSellerName(seller.getSellerName());
        newSeller.setPickupAddress(seller.getPickupAddress());
        newSeller.setGSTIN(seller.getGSTIN());
        newSeller.setRole(USER_ROLE.ROLE_SELLER);
        newSeller.setMobile(seller.getMobile());
        newSeller.setBankDetails(seller.getBankDetails());
        newSeller.setBusinessDetails(seller.getBusinessDetails());

        return sellerRepo.save(newSeller);
    }

    @Override
    public Seller getSellerById(Long id) throws SellerException {
        return sellerRepo.findById(id).orElseThrow(()->new SellerException("seller not found with id "+id));
    }

    @Override
    public Seller getSellerByEmail(String email) throws Exception {
        Seller seller=sellerRepo.findByEmail(email);
        if (seller==null){
            throw new Exception("Seller not found ....");
        }
        return seller;
    }

    @Override
    public List<Seller> getAllSellers(AccountStatus status) {
        if (status == null) {
            return sellerRepo.findAll();
        }
        return sellerRepo.findByAccountStatus(status);
    }

    @Override
    public Seller updateSeller(Long id, Seller seller) throws Exception {

        Seller existSeller = this.getSellerById(id);

        // Basic fields
        if (seller.getSellerName() != null) {
            existSeller.setSellerName(seller.getSellerName());
        }

        if (seller.getMobile() != null) {
            existSeller.setMobile(seller.getMobile());
        }

        if (seller.getEmail() != null) {
            existSeller.setEmail(seller.getEmail());
        }

        if (seller.getGSTIN() != null) {
            existSeller.setGSTIN(seller.getGSTIN());
        }

        // =========================
        // BUSINESS DETAILS UPDATE
        // =========================
        if (seller.getBusinessDetails() != null) {

            if (existSeller.getBusinessDetails() == null) {
                existSeller.setBusinessDetails(new BusinessDetails());
            }

            BusinessDetails existing = existSeller.getBusinessDetails();
            BusinessDetails incoming = seller.getBusinessDetails();

            if (incoming.getBusinessName() != null)
                existing.setBusinessName(incoming.getBusinessName());

            if (incoming.getBusinessEmail() != null)
                existing.setBusinessEmail(incoming.getBusinessEmail());

            if (incoming.getBusinessMobile() != null)
                existing.setBusinessMobile(incoming.getBusinessMobile());

            if (incoming.getBusinessAddress() != null)
                existing.setBusinessAddress(incoming.getBusinessAddress());

            if (incoming.getLogo() != null)
                existing.setLogo(incoming.getLogo());

            if (incoming.getBanner() != null)
                existing.setBanner(incoming.getBanner());
        }

        // =========================
        // BANK DETAILS UPDATE
        // =========================
        if (seller.getBankDetails() != null) {

            if (existSeller.getBankDetails() == null) {
                existSeller.setBankDetails(new BankDetails());
            }

            BankDetails existingBank = existSeller.getBankDetails();
            BankDetails incomingBank = seller.getBankDetails();

            if (incomingBank.getAccountHolderName() != null)
                existingBank.setAccountHolderName(incomingBank.getAccountHolderName());

            if (incomingBank.getIfscCode() != null)
                existingBank.setIfscCode(incomingBank.getIfscCode());

            if (incomingBank.getAccountNumber() != null)
                existingBank.setAccountNumber(incomingBank.getAccountNumber());
        }

        // =========================
        // PICKUP ADDRESS UPDATE
        // =========================
        if (seller.getPickupAddress() != null) {

            if (existSeller.getPickupAddress() == null) {
                existSeller.setPickupAddress(new Address());
            }

            Address existingAddress = existSeller.getPickupAddress();
            Address incomingAddress = seller.getPickupAddress();

            if (incomingAddress.getAddress() != null)
                existingAddress.setAddress(incomingAddress.getAddress());

            if (incomingAddress.getMobile() != null)
                existingAddress.setMobile(incomingAddress.getMobile());

            if (incomingAddress.getCity() != null)
                existingAddress.setCity(incomingAddress.getCity());

            if (incomingAddress.getState() != null)
                existingAddress.setState(incomingAddress.getState());

            if (incomingAddress.getPinCode() != null)
                existingAddress.setPinCode(incomingAddress.getPinCode());
        }

        return sellerRepo.save(existSeller);
    }

    @Override
    public void deleteSeller(Long id) throws Exception {
        Seller seller=this.getSellerById(id);

        sellerRepo.delete(seller);

    }

    @Override
    public Seller verifyEmail(String email, String otp) throws Exception {
        Seller seller=this.getSellerByEmail(email);
        seller.setEmailVerified(true);
        return sellerRepo.save(seller);
    }

    @Override
    public Seller updateSellerAccountStatus(Long sellerId, AccountStatus status) throws Exception {
        Seller seller=this.getSellerById(sellerId);
        seller.setAccountStatus(status);
        return sellerRepo.save(seller);
    }

//    @Override
//    public Seller registerSeller(Seller seller) throws Exception {
//
//        if (sellerRepo.findByEmail(seller.getEmail()) != null) {
//            throw new Exception("Seller already exists");
//        }
//
//        if (seller.getPassword() == null) {
//            throw new RuntimeException("Password required");
//        }
//
//        Address savedAddress = addressRepo.save(seller.getPickupAddress());
//
//        Seller newSeller = new Seller();
//        newSeller.setEmail(seller.getEmail());
//        newSeller.setPassword(passwordEncoder.encode(seller.getPassword()));
//        newSeller.setSellerName(seller.getSellerName());
//        newSeller.setPickupAddress(savedAddress);
//        newSeller.setGSTIN(seller.getGSTIN());
//        newSeller.setRole(USER_ROLE.ROLE_SELLER);
//        newSeller.setMobile(seller.getMobile());
//        newSeller.setBankDetails(seller.getBankDetails());
//        newSeller.setBusinessDetails(seller.getBusinessDetails());
//
//        Seller savedSeller = sellerRepo.save(newSeller);
//
//        // 🔥 OTP GENERATION
//        String otp = OtpUtil.generateOtp();
//
//        VerificationCode code = new VerificationCode();
//        code.setOtp(otp);
//        code.setEmail(savedSeller.getEmail());
//        code.setExpiresAt(LocalDateTime.now().plusMinutes(10));
//
//        verificationCodeRepo.save(code);
//
//        // 🔥 Dynamic frontend URL
//        String verifyLink = frontendUrl + "/verify-seller/" + otp;
//
//        String html = "<h2>Verify Account</h2>" +
//                "<a href='" + verifyLink + "'>Click to verify</a>" +
//                "<p>OTP: " + otp + "</p>";
//
//        emailService.sendVerificationOtpEmail(
//                savedSeller.getEmail(),
//                otp,
//                "Verify your account",
//                html
//        );
//
//        return savedSeller;
//    }
}
