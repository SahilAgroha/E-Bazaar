package com.sheoran.controller;

import com.sheoran.model.Cart;
import com.sheoran.model.CartItem;
import com.sheoran.model.Product;
import com.sheoran.model.User;
import com.sheoran.request.AddItemRequest;
import com.sheoran.response.ApiResponse;
import com.sheoran.service.CartItemService;
import com.sheoran.service.CartService;
import com.sheoran.service.ProductService;
import com.sheoran.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    @Autowired
    private CartService cartService;
    @Autowired
    CartItemService cartItemService;
    @Autowired
    private UserService userService;
    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<Cart> findUserCartHandler(@RequestHeader("Authorization") String jwt) throws Exception {
        User user=userService.findUserByJwtToken(jwt);

        Cart cart=cartService.findUserCart(user);

        return new ResponseEntity<>(cart, HttpStatus.OK);
    }

    @PutMapping("/add")
    public ResponseEntity<CartItem> addItemToCart(@RequestBody AddItemRequest request, @RequestHeader("Authorization") String jwt ) throws Exception {
        User user=userService.findUserByJwtToken(jwt);
        Product product=productService.findProductById(request.getProductId());

        CartItem item=cartService.addCartItem(user,product, request.getSize(),request.getQuantity());

        ApiResponse response=new ApiResponse();
        response.setMessage("Item Added To Cart Successfully");

        return new ResponseEntity<>(item,HttpStatus.ACCEPTED);
    }

    @DeleteMapping("/item/{cartItemId}")
    public ResponseEntity<ApiResponse> deleteCartItemHandler(@PathVariable Long cartItemId,
                                                      @RequestHeader("Authorization") String jwt) throws Exception {
        User user=userService.findUserByJwtToken(jwt);
        cartItemService.removeCartItem(user.getId(),cartItemId);
        ApiResponse response=new ApiResponse();
        response.setMessage("Item remove From cart");
        return new ResponseEntity<>(response,HttpStatus.ACCEPTED);
    }

    @PutMapping("/item/{cartItemId}")
    public ResponseEntity<CartItem> updateCartItemHandler(@PathVariable Long cartItemId,
                                                          @RequestHeader("Authorization") String jwt,
                                                          @RequestBody CartItem cartItem) throws Exception {
        User user=userService.findUserByJwtToken(jwt);
        CartItem updatedcartItem=null;
        if (cartItem.getQuantity()>0){
            updatedcartItem=cartItemService.updateCartItem(user.getId(),cartItemId,cartItem);
        }

        return new ResponseEntity<>(updatedcartItem,HttpStatus.ACCEPTED);
    }
}
