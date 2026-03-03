package com.sheoran.service;

import com.sheoran.model.Cart;
import com.sheoran.model.Coupon;
import com.sheoran.model.User;

import java.math.BigDecimal;
import java.util.List;

public interface CouponService {
    Cart applyCoupon(String code, BigDecimal orderValue, User user) throws Exception;
    Cart removeCoupon(String code ,User user) throws Exception;
    Coupon findCouponById(Long id) throws Exception;
    Coupon createCoupon(Coupon coupon);
    List<Coupon> findAllCoupon();
    void deleteCoupon(Long id) throws Exception;
}
