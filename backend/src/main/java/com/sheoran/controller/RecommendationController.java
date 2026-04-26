package com.sheoran.controller;

import com.sheoran.model.Product;
import com.sheoran.model.User;
import com.sheoran.service.RecommendationService;
import com.sheoran.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<Product>> getRecommendations(
            @RequestHeader(value = "Authorization", required = false) String jwt,
            @RequestParam(required = false) Long currentProductId) throws Exception {

        User user = null;
        if (jwt != null && !jwt.trim().isEmpty() && !jwt.equals("Bearer null") && !jwt.equals("null")) {
            try {
                user = userService.findUserByJwtToken(jwt);
            } catch (Exception e) {
                System.out.println("Invalid or expired JWT in recommendation controller");
            }
        }

        Long userId = user != null ? user.getId() : null;
        List<Product> recommendations = recommendationService.getRecommendations(userId, currentProductId);
        return ResponseEntity.ok(recommendations);
    }
}
