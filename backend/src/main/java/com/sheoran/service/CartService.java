package com.sheoran.service;

import com.sheoran.model.Cart;
import com.sheoran.model.CartItem;
import com.sheoran.model.Product;
import com.sheoran.model.User;

public interface CartService {

    CartItem addCartItem(User user, Product product, String size,int quantity);
    Cart findUserCart(User user) throws IllegalAccessException;

}
