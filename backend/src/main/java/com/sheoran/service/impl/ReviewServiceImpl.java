package com.sheoran.service.impl;

import com.sheoran.model.Product;
import com.sheoran.model.Review;
import com.sheoran.model.User;
import com.sheoran.repository.ReviewRepo;
import com.sheoran.request.CreateReviewRequest;
import com.sheoran.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewServiceImpl implements ReviewService {
    @Autowired
    private ReviewRepo reviewRepo;

    @Override
    public Review createReview(CreateReviewRequest request, User user, Product product) {
        Review review=new Review();
        review.setUser(user);
        review.setProduct(product);
        review.setReviewText(request.getReviewText());
        review.setRating(request.getReviewRating());
        review.setProductImages(request.getProductImages());
        return reviewRepo.save(review);
    }

    @Override
    public List<Review> getReviewByProductId(Long productId) {
        return reviewRepo.findByProductId(productId);
    }

    @Override
    public Review updateReview(Long reviewId, String reviewText, double rating, Long userId) throws Exception {
        Review review=getReviewById(reviewId);
        if (review.getUser().getId().equals(userId)){
            review.setReviewText(reviewText);
            review.setRating(rating);
            return reviewRepo.save(review);
        }
        throw new Exception("you can't update this review");
    }

    @Override
    public void deleteReview(Long reviewId, Long userId) throws Exception {
        Review review=getReviewById(reviewId);
        if (review.getUser().getId().equals(userId)){
            throw new Exception("you can't delete this review");
        }
        reviewRepo.delete(review);
    }

    @Override
    public Review getReviewById(Long reviewId) throws Exception {
        return reviewRepo.findById(reviewId).orElseThrow(()->
                new Exception("review not found"));
    }
}
