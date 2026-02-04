package com.sheoran.service.impl;

import com.sheoran.model.Cart;
import com.sheoran.model.Coupon;
import com.sheoran.model.User;
import com.sheoran.repository.CartRepo;
import com.sheoran.repository.CouponRepo;
import com.sheoran.repository.UserRepo;
import com.sheoran.service.CouponService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CouponServiceImpl implements CouponService {
    @Autowired
    private CouponRepo couponRepo;
    @Autowired
    private CartRepo cartRepo;
    @Autowired
    private UserRepo userRepo;

    @Override
    public Cart applyCoupon(String code, double orderValue, User user) throws Exception {
        Coupon coupon=couponRepo.findByCode(code);
        Cart cart=cartRepo.findByUserId(user.getId());
        if (coupon==null){
            throw new Exception("coupon not valid");
        }
        if (user.getUsedCoupons().contains(coupon)){
            throw new Exception("Coupon already used");
        }
        if (orderValue<coupon.getMinimumOrderValue()){
            throw new Exception("valid for minimum order value "+coupon.getMinimumOrderValue());
        }
        if (coupon.isActive()){
            user.getUsedCoupons().add(coupon);
            userRepo.save(user);

            double discountedPrice=(cart.getTotalSellingPrice()*coupon.getDiscountPercentage())/100;
            cart.setTotalSellingPrice(cart.getTotalSellingPrice()-discountedPrice);
            cart.setCouponCode(code);
            cartRepo.save(cart);
        }
        throw new Exception("coupon not valid ");
    }

    @Override
    public Cart removeCoupon(String code, User user) throws Exception {
        Coupon coupon=couponRepo.findByCode(code);
        if (coupon==null){
            throw new Exception("coupon not valid");
        }
        Cart cart=cartRepo.findByUserId(user.getId());
        double discountedPrice=(cart.getTotalSellingPrice()*coupon.getDiscountPercentage())/100;
        cart.setTotalSellingPrice(cart.getTotalSellingPrice()+discountedPrice);
        cart.setCouponCode(null);

        return cartRepo.save(cart);
    }

    @Override
    public Coupon findCouponById(Long id) throws Exception {
        return couponRepo.findById(id).orElseThrow(()->
                 new Exception("coupon not found"));
    }

    @Override
    @PreAuthorize("hasRole ('ADMIN')")
    public Coupon createCoupon(Coupon coupon) {
        return couponRepo.save(coupon);
    }

    @Override
    public List<Coupon> findAllCoupon() {
        return couponRepo.findAll();
    }

    @Override
    @PreAuthorize("hasRole ('ADMIN')")
    public void deleteCoupon(Long id) throws Exception {
        findCouponById(id);
        couponRepo.deleteById(id);
    }
}
