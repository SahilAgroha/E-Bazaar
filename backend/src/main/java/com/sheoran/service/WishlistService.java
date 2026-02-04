package com.sheoran.service;

import com.sheoran.model.Product;
import com.sheoran.model.User;
import com.sheoran.model.WishList;

public interface WishlistService {
    WishList createWishlist(User user);
    WishList getWishlistByUserId(User user);
    WishList addProductToWishlist(User user, Product product);
}
