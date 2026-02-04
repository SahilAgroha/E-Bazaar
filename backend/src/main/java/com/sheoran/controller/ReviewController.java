package com.sheoran.controller;

import com.sheoran.model.Product;
import com.sheoran.model.Review;
import com.sheoran.model.User;
import com.sheoran.request.CreateReviewRequest;
import com.sheoran.response.ApiResponse;
import com.sheoran.service.ProductService;
import com.sheoran.service.ReviewService;
import com.sheoran.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ReviewController {
    @Autowired
    private ReviewService reviewService;
    @Autowired
    private UserService userService;
    @Autowired
    private ProductService productService;

    @GetMapping("products/{productId}/reviews")
    public ResponseEntity<List<Review>> getReviewByProductId(@PathVariable Long productId){
        List<Review> reviews=reviewService.getReviewByProductId(productId);
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }

    @PostMapping("/products/{productId}/reviews")
    public ResponseEntity<Review> writeReview(@PathVariable Long productId,
                                              @RequestBody CreateReviewRequest request,
                                              @RequestHeader("Authorization") String jwt) throws Exception {
        User user=userService.findUserByJwtToken(jwt);
        Product product=productService.findProductById(productId);
        Review review=reviewService.createReview(request,user,product);
        return new ResponseEntity<>(review,HttpStatus.OK);
    }

    @PatchMapping("/reviews/{reviewId}")
    public ResponseEntity<Review> updateReview(@RequestHeader("Authorization") String jwt,
                                               @PathVariable Long reviewId,
                                               @RequestBody CreateReviewRequest request) throws Exception {


        User user=userService.findUserByJwtToken(jwt);
        Review review=reviewService.updateReview(reviewId, request.getReviewText(), request.getReviewRating(), user.getId());
        return new ResponseEntity<>(review,HttpStatus.OK);
    }

    @DeleteMapping("/reviews/{reviewId}")
    public ResponseEntity<ApiResponse> deleteReview(@PathVariable Long reviewId,
                                                    @RequestHeader("Authorization") String jwt) throws Exception {
        User user =userService.findUserByJwtToken(jwt);
        reviewService.deleteReview(reviewId, user.getId());
        ApiResponse response=new ApiResponse();
        response.setMessage("Review deleted successfully");
        return new ResponseEntity<>(response,HttpStatus.OK);
    }


}
