package com.sheoran.service.impl;

import com.sheoran.model.Cart;
import com.sheoran.model.CartItem;
import com.sheoran.model.Product;
import com.sheoran.model.User;
import com.sheoran.repository.CartItemRepo;
import com.sheoran.repository.CartRepo;
import com.sheoran.service.CartService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
// @RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepo cartRepo;
    @Autowired
    private CartItemRepo cartItemRepo;
    @Autowired
    private com.sheoran.repository.CouponRepo couponRepo;

    @Override
    public CartItem addCartItem(User user, Product product, String size, int quantity) {

        Cart cart = cartRepo.findByUserId(user.getId());
        CartItem isPresent = cartItemRepo.findByCartAndProductAndSize(cart, product, size);

        if (isPresent == null) {

            CartItem cartItem = new CartItem();
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
            cartItem.setSize(size);
            cartItem.setCart(cart);

            BigDecimal qty = BigDecimal.valueOf(quantity);

            cartItem.setSellingPrice(
                    product.getSellingPrice().multiply(qty));

            cartItem.setMrpPrice(
                    product.getMrpPrice().multiply(qty));

            cart.getCartItems().add(cartItem);

            return cartItemRepo.save(cartItem);
        }

        return isPresent;
    }

    @Override
    public Cart findUserCart(User user) {

        Cart cart = cartRepo.findByUserId(user.getId());

        BigDecimal totalMrpPrice = BigDecimal.ZERO;
        BigDecimal totalSellingPrice = BigDecimal.ZERO;
        int totalItem = 0;

        for (CartItem cartItem : cart.getCartItems()) {

            // Always sync the latest product prices into the cart item
            BigDecimal qty = BigDecimal.valueOf(cartItem.getQuantity());
            BigDecimal itemMrp = cartItem.getProduct().getMrpPrice().multiply(qty);
            BigDecimal itemSelling = cartItem.getProduct().getSellingPrice().multiply(qty);

            cartItem.setMrpPrice(itemMrp);
            cartItem.setSellingPrice(itemSelling);
            cartItemRepo.save(cartItem);

            totalMrpPrice = totalMrpPrice.add(itemMrp);
            totalSellingPrice = totalSellingPrice.add(itemSelling);
            totalItem += cartItem.getQuantity();
        }

        cart.setTotalMrpPrice(totalMrpPrice);
        cart.setTotalSellingPrice(totalSellingPrice);
        cart.setTotalItem(totalItem);


        int couponDiscountPercentage = 0;
        if (cart.getCouponCode() != null) {
            com.sheoran.model.Coupon coupon = couponRepo.findByCode(cart.getCouponCode());
            if (coupon != null && coupon.isActive()) {
                BigDecimal discountAmount = totalSellingPrice
                        .multiply(coupon.getDiscountPercentage())
                        .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
                totalSellingPrice = totalSellingPrice.subtract(discountAmount);
                cart.setTotalSellingPrice(totalSellingPrice);
                couponDiscountPercentage = coupon.getDiscountPercentage().intValue();
            } else {
                cart.setCouponCode(null);
            }
        }

        cart.setDiscount(couponDiscountPercentage);

        return cart;
    }

    private int calculateDiscountPercentage(
            BigDecimal mrpPrice,
            BigDecimal sellingPrice) {

        if (mrpPrice.compareTo(BigDecimal.ZERO) <= 0) {
            return 0;
        }

        BigDecimal discount = mrpPrice.subtract(sellingPrice);

        BigDecimal percentage = discount
                .divide(mrpPrice, 2, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));

        return percentage.intValue();
    }
}