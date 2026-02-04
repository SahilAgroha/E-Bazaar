package com.sheoran.controller;

import com.sheoran.model.Product;
import com.sheoran.model.User;
import com.sheoran.model.WishList;
import com.sheoran.service.ProductService;
import com.sheoran.service.UserService;
import com.sheoran.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;
    @Autowired
    private UserService userService;
    @Autowired
    private ProductService productService;

    @GetMapping()
    public ResponseEntity<WishList> getWishlistByUserId(@RequestHeader("Authorization") String jwt) throws Exception {
        User user=userService.findUserByJwtToken(jwt);
        WishList wishList=wishlistService.getWishlistByUserId(user);
        return new ResponseEntity<>(wishList, HttpStatus.OK);
    }

    @PostMapping("/add-product/{productId}")
    public ResponseEntity<WishList> addProductToWishList(@PathVariable Long productId,
                                                         @RequestHeader("Authorization") String jwt) throws Exception {
        Product product = productService.findProductById(productId);
        User user=userService.findUserByJwtToken(jwt);
        WishList updateWishlist=wishlistService.addProductToWishlist(user,product);
        return new ResponseEntity<>(updateWishlist,HttpStatus.OK);
    }
}
