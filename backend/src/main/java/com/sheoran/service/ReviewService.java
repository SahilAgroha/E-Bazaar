package com.sheoran.service;

import com.sheoran.model.Product;
import com.sheoran.model.Review;
import com.sheoran.model.User;
import com.sheoran.request.CreateReviewRequest;

import java.util.List;

public interface ReviewService {
    Review createReview(CreateReviewRequest request, User user, Product product);
    List<Review> getReviewByProductId(Long productId);
    Review updateReview(Long reviewId,String reviewText,double rating,Long userId) throws Exception;
    void deleteReview(Long reviewId,Long userId) throws Exception;
    Review getReviewById(Long reviewId) throws Exception;

}
