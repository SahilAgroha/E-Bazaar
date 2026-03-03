package com.sheoran.service.impl;

import com.sheoran.model.Cart;
import com.sheoran.model.Coupon;
import com.sheoran.model.User;
import com.sheoran.repository.CartRepo;
import com.sheoran.repository.CouponRepo;
import com.sheoran.repository.UserRepo;
import com.sheoran.service.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class CouponServiceImpl implements CouponService {
    @Autowired
    private  CouponRepo couponRepo;

    @Autowired
    private CartRepo cartRepo;

    @Autowired
    private UserRepo userRepo;

    @Override
    public Cart applyCoupon(String code, BigDecimal orderValue, User user) throws Exception {

        Coupon coupon = couponRepo.findByCode(code);
        Cart cart = cartRepo.findByUserId(user.getId());

        if (coupon == null) {
            throw new Exception("Coupon not valid");
        }

        if (user.getUsedCoupons().contains(coupon)) {
            throw new Exception("Coupon already used");
        }

        if (orderValue.compareTo(coupon.getMinimumOrderValue()) < 0) {
            throw new Exception(
                    "Valid for minimum order value " + coupon.getMinimumOrderValue()
            );
        }

        if (!coupon.isActive()) {
            throw new Exception("Coupon not active");
        }

        // Add coupon to used list
        user.getUsedCoupons().add(coupon);
        userRepo.save(user);

        // Calculate discount
        BigDecimal discountAmount = cart.getTotalSellingPrice()
                .multiply(coupon.getDiscountPercentage())
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

        BigDecimal finalPrice = cart.getTotalSellingPrice().subtract(discountAmount);

        cart.setTotalSellingPrice(finalPrice);
        cart.setCouponCode(code);

        return cartRepo.save(cart);
    }

    @Override
    public Cart removeCoupon(String code, User user) throws Exception {

        Coupon coupon = couponRepo.findByCode(code);

        if (coupon == null) {
            throw new Exception("Coupon not valid");
        }

        Cart cart = cartRepo.findByUserId(user.getId());

        BigDecimal discountAmount = cart.getTotalSellingPrice()
                .multiply(coupon.getDiscountPercentage())
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

        cart.setTotalSellingPrice(
                cart.getTotalSellingPrice().add(discountAmount)
        );

        cart.setCouponCode(null);

        return cartRepo.save(cart);
    }

    @Override
    public Coupon findCouponById(Long id) throws Exception {
        return couponRepo.findById(id)
                .orElseThrow(() -> new Exception("Coupon not found"));
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public Coupon createCoupon(Coupon coupon) {
        return couponRepo.save(coupon);
    }

    @Override
    public List<Coupon> findAllCoupon() {
        return couponRepo.findAll();
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteCoupon(Long id) throws Exception {
        findCouponById(id);
        couponRepo.deleteById(id);
    }
}