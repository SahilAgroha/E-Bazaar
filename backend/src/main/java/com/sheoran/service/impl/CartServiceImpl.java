package com.sheoran.service.impl;

import com.sheoran.model.Cart;
import com.sheoran.model.CartItem;
import com.sheoran.model.Product;
import com.sheoran.model.User;
import com.sheoran.repository.CartItemRepo;
import com.sheoran.repository.CartRepo;
import com.sheoran.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
//@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepo cartRepo;
    @Autowired
    private CartItemRepo cartItemRepo;

    @Override
    public CartItem addCartItem(User user, Product product, String size, int quantity) {

        Cart cart = cartRepo.findByUserId(user.getId());
        CartItem isPresent =
                cartItemRepo.findByCartAndProductAndSize(cart, product, size);

        if (isPresent == null) {

            CartItem cartItem = new CartItem();
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
            cartItem.setSize(size);
            cartItem.setCart(cart);

            BigDecimal qty = BigDecimal.valueOf(quantity);

            cartItem.setSellingPrice(
                    product.getSellingPrice().multiply(qty)
            );

            cartItem.setMrpPrice(
                    product.getMrpPrice().multiply(qty)
            );

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

            totalMrpPrice = totalMrpPrice.add(cartItem.getMrpPrice());
            totalSellingPrice = totalSellingPrice.add(cartItem.getSellingPrice());
            totalItem += cartItem.getQuantity();
        }

        cart.setTotalMrpPrice(totalMrpPrice);
        cart.setTotalSellingPrice(totalSellingPrice);
        cart.setTotalItem(totalItem);

        cart.setDiscount(
                calculateDiscountPercentage(totalMrpPrice, totalSellingPrice)
        );

        return cart;
    }

    private int calculateDiscountPercentage(
            BigDecimal mrpPrice,
            BigDecimal sellingPrice
    ) {

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