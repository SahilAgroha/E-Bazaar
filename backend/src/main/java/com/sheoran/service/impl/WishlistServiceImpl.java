package com.sheoran.service.impl;

import com.sheoran.model.Product;
import com.sheoran.model.User;
import com.sheoran.model.WishList;
import com.sheoran.repository.WishlistRepo;
import com.sheoran.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WishlistServiceImpl implements WishlistService {

    @Autowired
    private WishlistRepo wishlistRepo;


    @Override
    public WishList createWishlist(User user) {
        WishList wishList=new WishList();
        wishList.setUser(user);
        return wishlistRepo.save(wishList);
    }

    @Override
    public WishList getWishlistByUserId(User user) {
        WishList wishList=wishlistRepo.findByUserId(user.getId());
        if (wishList==null){
            wishList=createWishlist(user);
        }
        return wishList;
    }

    @Override
    public WishList addProductToWishlist(User user, Product product) {
        WishList wishList=getWishlistByUserId(user);
        if (wishList.getProducts().contains(product)){
            wishList.getProducts().remove(product);
        } else {
            wishList.getProducts().add(product);
        }
        return wishlistRepo.save(wishList);
    }
}
