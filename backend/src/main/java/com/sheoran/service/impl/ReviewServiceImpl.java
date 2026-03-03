package com.sheoran.service.impl;

import com.sheoran.model.Product;
import com.sheoran.model.Review;
import com.sheoran.model.User;
import com.sheoran.repository.ReviewRepo;
import com.sheoran.request.CreateReviewRequest;
import com.sheoran.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
//@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepo reviewRepo;

    @Override
    public Review createReview(
            CreateReviewRequest request,
            User user,
            Product product
    ) {

        if (request.getReviewRating()
                .compareTo(BigDecimal.ONE) < 0 ||
                request.getReviewRating()
                        .compareTo(BigDecimal.valueOf(5)) > 0) {

            throw new IllegalArgumentException(
                    "Rating must be between 1 and 5"
            );
        }

        Review review = new Review();
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
    public Review updateReview(
            Long reviewId,
            String reviewText,
            BigDecimal rating,
            Long userId
    ) throws Exception {

        Review review = getReviewById(reviewId);

        if (!review.getUser().getId().equals(userId)) {
            throw new Exception("You can't update this review");
        }

        if (rating.compareTo(BigDecimal.ONE) < 0 ||
                rating.compareTo(BigDecimal.valueOf(5)) > 0) {

            throw new IllegalArgumentException(
                    "Rating must be between 1 and 5"
            );
        }

        review.setReviewText(reviewText);
        review.setRating(rating);

        return reviewRepo.save(review);
    }

    @Override
    public void deleteReview(Long reviewId, Long userId)
            throws Exception {

        Review review = getReviewById(reviewId);

        if (!review.getUser().getId().equals(userId)) {
            throw new Exception("You can't delete this review");
        }

        reviewRepo.delete(review);
    }

    @Override
    public Review getReviewById(Long reviewId)
            throws Exception {

        return reviewRepo.findById(reviewId)
                .orElseThrow(() ->
                        new Exception("Review not found")
                );
    }
}