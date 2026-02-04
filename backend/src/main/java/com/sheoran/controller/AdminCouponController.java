package com.sheoran.controller;

import com.sheoran.model.Cart;
import com.sheoran.model.Coupon;
import com.sheoran.model.User;
import com.sheoran.service.CartService;
import com.sheoran.service.CouponService;
import com.sheoran.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coupons")
public class AdminCouponController {

    @Autowired
    private CouponService couponService;
    @Autowired
    private UserService userService;
    @Autowired
    private CartService cartService;

    @PostMapping("/apply")
    public ResponseEntity<Cart> applyCoupon(@RequestParam String apply,
                                            @RequestParam String code,
                                            @RequestParam double orderValue,
                                            @RequestHeader("Authorization") String jwt) throws Exception {
        User user=userService.findUserByJwtToken(jwt);
        Cart cart;
        if (apply.equals("true")){
            cart=couponService.applyCoupon(code,orderValue,user);
        } else {
            cart=couponService.removeCoupon(code,user);
        }
        return new ResponseEntity<>(cart, HttpStatus.OK);
    }

    @PostMapping("/admin/create")
    public ResponseEntity<Coupon> createCoupon(@RequestBody Coupon coupon){
        Coupon createdCoupon=couponService.createCoupon(coupon);
        return new ResponseEntity<>(createdCoupon,HttpStatus.CREATED);
    }

    @DeleteMapping("admin/delete/{id}")
    public ResponseEntity<?> deleteCoupon(@PathVariable Long id) throws Exception {
        couponService.deleteCoupon(id);
        return new ResponseEntity<>("Coupon deleted successfully",HttpStatus.OK);
    }

    @GetMapping("/admin/all")
    public ResponseEntity<List<Coupon>> getAllCoupon(){
        List<Coupon> coupons=couponService.findAllCoupon();
        return new ResponseEntity<>(coupons,HttpStatus.OK);
    }



}
