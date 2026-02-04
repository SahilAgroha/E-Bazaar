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

import java.util.HashSet;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepo cartRepo;
    @Autowired
    private CartItemRepo cartItemRepo;


    @Override
    public CartItem addCartItem(User user, Product product, String size, int quantity) {
        Cart cart=cartRepo.findByUserId(user.getId());
        CartItem isPresent=cartItemRepo.findByCartAndProductAndSize(cart,product,size);

        if (isPresent==null){
            CartItem cartItem=new CartItem();
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
            cartItem.setUserId(user.getId());
            cartItem.setSize(size);

            int totalPrice=quantity*product.getSellingPrice();
            cartItem.setSellingPrice(totalPrice);
            cartItem.setMrpPrice(quantity*product.getMrpPrice());

            cart.getCartItems().add(cartItem);
            cartItem.setCart(cart);
            return cartItemRepo.save(cartItem);
        }

        return isPresent;
    }

    @Override
    public Cart findUserCart(User user) throws IllegalAccessException {
        Cart cart=cartRepo.findByUserId(user.getId());
//        if (cart == null) {
//            cart = new Cart();
//            cart.setUser(user);
//            cart.setCartItems(new HashSet<>()); // make sure to initialize the set
//            cart = cartRepo.save(cart);
//        }

        int totalPrice=0;
        int totalDiscountedPrice=0;
        int totalItem=0;

        for (CartItem cartItem: cart.getCartItems()){
            totalPrice+=cartItem.getMrpPrice();
            totalDiscountedPrice+=cartItem.getSellingPrice();
            totalItem+=cartItem.getQuantity();
        }

        cart.setTotalMrpPrice(totalPrice);
        cart.setTotalSellingPrice(totalDiscountedPrice);
        cart.setTotalItem(totalItem);
        cart.setDiscount(calculateDiscountPercentage(totalPrice,totalDiscountedPrice));


        return cart;
    }

    private int calculateDiscountPercentage(int mrpPrice, int sellingPrice) throws IllegalAccessException {
        if(mrpPrice<=0){
            return 0;
        }
        double discount =mrpPrice-sellingPrice;
        double discountPercentage=(discount/mrpPrice)*100;
        return (int)discountPercentage;
    }
}
