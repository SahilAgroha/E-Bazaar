package com.sheoran.service.impl;

import com.sheoran.config.JwtProvider;
import com.sheoran.domain.AccountStatus;
import com.sheoran.domain.USER_ROLE;
import com.sheoran.exceptions.SellerException;
import com.sheoran.model.Address;
import com.sheoran.model.Seller;
import com.sheoran.repository.AddressRepo;
import com.sheoran.repository.SellerRepo;
import com.sheoran.service.SellerService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
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
        return sellerRepo.findByAccountStatus(status);
    }

    @Override
    public Seller updateSeller(Long id, Seller seller) throws Exception {
        Seller existSeller=this.getSellerById(id);
        if(seller.getSellerName()!=null){
            existSeller.setSellerName(seller.getSellerName());
        }
        if (seller.getMobile()!=null){
            existSeller.setMobile(seller.getMobile());
        }
        if (seller.getEmail()!=null){
            existSeller.setEmail(seller.getEmail());
        }
        if (seller.getBusinessDetails()!=null && seller.getBusinessDetails().getBusinessName()!=null){
            existSeller.getBusinessDetails().setBusinessName(seller.getBusinessDetails().getBusinessName());
        }
        if (seller.getBankDetails()!=null && seller.getBankDetails().getAccountHolderName()!=null
            && seller.getBankDetails().getIfscCode()!=null && seller.getBankDetails().getAccountNumber()!=null){

            existSeller.getBankDetails().setAccountHolderName(seller.getBankDetails().getAccountHolderName());
            existSeller.getBankDetails().setIfscCode(seller.getBankDetails().getIfscCode());
            existSeller.getBankDetails().setAccountNumber(seller.getBankDetails().getAccountNumber());
        }
        if (seller.getPickupAddress()!=null && seller.getPickupAddress().getAddress()!=null
            && seller.getPickupAddress().getMobile()!=null && seller.getPickupAddress().getCity()!=null
            && seller.getPickupAddress().getState()!=null){

            existSeller.getPickupAddress().setAddress(seller.getPickupAddress().getAddress());
            existSeller.getPickupAddress().setMobile(seller.getPickupAddress().getMobile());
            existSeller.getPickupAddress().setCity(seller.getPickupAddress().getCity());
            existSeller.getPickupAddress().setState(seller.getPickupAddress().getState());
            existSeller.getPickupAddress().setPinCode(seller.getPickupAddress().getPinCode());
        }
        if (seller.getGSTIN()!=null){
            existSeller.setGSTIN(seller.getGSTIN());
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
}
