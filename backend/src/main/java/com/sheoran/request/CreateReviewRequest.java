package com.sheoran.request;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
@Data
public class CreateReviewRequest {
    private String reviewText;
    private BigDecimal reviewRating;
    private List<String> productImages;

    public String getReviewText() {
        return reviewText;
    }

    public void setReviewText(String reviewText) {
        this.reviewText = reviewText;
    }

    public BigDecimal getReviewRating() {
        return reviewRating;
    }

    public void setReviewRating(BigDecimal reviewRating) {
        this.reviewRating = reviewRating;
    }

    public List<String> getProductImages() {
        return productImages;
    }

    public void setProductImages(List<String> productImages) {
        this.productImages = productImages;
    }
}
