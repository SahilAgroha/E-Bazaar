package com.sheoran.service.impl;

import com.sheoran.model.CartItem;
import com.sheoran.model.User;
import com.sheoran.repository.CartItemRepo;
import com.sheoran.service.CartItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CartItemServiceImpl implements CartItemService {

    @Autowired
    private CartItemRepo cartItemRepo;

    @Override
    public CartItem updateCartItem(Long userId, Long id, CartItem cartItem) throws Exception {
        CartItem item=findCartItemById(id);

        User cartItemUser=item.getCart().getUser();
        if (cartItemUser.getId().equals(userId)){
            item.setQuantity(cartItem.getQuantity());
            item.setMrpPrice(item.getQuantity()*item.getProduct().getMrpPrice());
            item.setSellingPrice(item.getQuantity()*item.getProduct().getSellingPrice());
            return cartItemRepo.save(item);
        }
        throw  new Exception("you can't update this cartItem");
    }

    @Override
    public void removeCartItem(Long userId, Long cartItemId) throws Exception {
        CartItem item=findCartItemById(cartItemId);

        User cartItemUser=item.getCart().getUser();
        if(cartItemUser.getId().equals(userId)){
            cartItemRepo.delete(item);
        }
        else throw new Exception("you can't delete this item");

    }

    @Override
    public CartItem findCartItemById(Long id) throws Exception {
        return cartItemRepo.findById(id).orElseThrow(()->
                new Exception("cart item not found"));
    }
}
