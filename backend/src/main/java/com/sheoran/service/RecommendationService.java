package com.sheoran.service;

import com.sheoran.model.Product;
import java.util.List;

public interface RecommendationService {
    List<Product> getRecommendations(Long userId, Long currentProductId);
}
