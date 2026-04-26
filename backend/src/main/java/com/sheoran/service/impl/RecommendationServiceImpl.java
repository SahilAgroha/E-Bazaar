package com.sheoran.service.impl;

import com.sheoran.dto.GeminiRequest;
import com.sheoran.dto.GeminiResponse;
import com.sheoran.model.Order;
import com.sheoran.model.OrderItem;
import com.sheoran.model.Product;
import com.sheoran.model.WishList;
import com.sheoran.repository.OrderRepo;
import com.sheoran.repository.ProductRepo;
import com.sheoran.repository.WishlistRepo;
import com.sheoran.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationServiceImpl implements RecommendationService {

    @Autowired
    private OrderRepo orderRepo;

    @Autowired
    private WishlistRepo wishlistRepo;

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=";

    @Override
    public List<Product> getRecommendations(Long userId, Long currentProductId) {
        List<Order> userOrders = null;
        WishList wishlist = null;
        if (userId != null) {
            userOrders = orderRepo.findByUserId(userId);
            wishlist = wishlistRepo.findByUserId(userId);
        }
        
        Set<String> purchasedCategories = new HashSet<>();
        if (userOrders != null) {
            for (Order order : userOrders) {
                for (OrderItem item : order.getOrderItems()) {
                    if (item.getProduct() != null && item.getProduct().getCategory() != null) {
                        purchasedCategories.add(item.getProduct().getCategory().getName());
                    }
                }
            }
        }
        
        Set<String> wishlistCategories = new HashSet<>();
        if (wishlist != null && wishlist.getProducts() != null) {
            for (Product p : wishlist.getProducts()) {
                if (p.getCategory() != null) {
                    wishlistCategories.add(p.getCategory().getName());
                }
            }
        }

        // Step 2: Fetch current product details
        Product currentProduct = null;
        if (currentProductId != null) {
            currentProduct = productRepo.findById(currentProductId).orElse(null);
        }

        // Available catalog summary (limited for prompt size, e.g., 50 products)
        List<Product> allProducts = productRepo.findAll();
        String catalogSummary = allProducts.stream()
                .limit(50)
                .map(p -> "ID: " + p.getId() + ", Title: " + p.getTitle() + ", Category: " + (p.getCategory() != null ? p.getCategory().getName() : "None"))
                .collect(Collectors.joining("\n"));

        // Step 3: Construct prompt
        StringBuilder promptBuilder = new StringBuilder();
        promptBuilder.append("You are an AI product recommendation engine.\n");
        promptBuilder.append("User Behavioral Profile:\n");
        promptBuilder.append("- Categories previously purchased: ").append(purchasedCategories.isEmpty() ? "None" : String.join(", ", purchasedCategories)).append("\n");
        promptBuilder.append("- Categories in wishlist: ").append(wishlistCategories.isEmpty() ? "None" : String.join(", ", wishlistCategories)).append("\n");
        
        if (currentProduct != null) {
            promptBuilder.append("\nCurrent Product Context (User is currently viewing):\n");
            promptBuilder.append("- Title: ").append(currentProduct.getTitle()).append("\n");
            promptBuilder.append("- Category: ").append(currentProduct.getCategory() != null ? currentProduct.getCategory().getName() : "None").append("\n");
            promptBuilder.append("- Description: ").append(currentProduct.getDescription()).append("\n");
        }

        promptBuilder.append("\nAvailable Product Catalog:\n");
        promptBuilder.append(catalogSummary).append("\n");
        
        promptBuilder.append("\nBased on the user's behavioral profile and the current product context, recommend exactly 5 product IDs from the Available Product Catalog that the user is most likely to be interested in.\n");
        promptBuilder.append("Return ONLY a comma-separated list of product IDs (e.g. 1, 5, 12, 34, 45). Do not include any other text or reasoning.");

        List<Product> recommendations = new ArrayList<>();

        // Step 4: Send prompt to Gemini API
        if (geminiApiKey != null && !geminiApiKey.trim().isEmpty()) {
            GeminiRequest request = new GeminiRequest();
            GeminiRequest.Content content = new GeminiRequest.Content();
            GeminiRequest.Part part = new GeminiRequest.Part();
            part.setText(promptBuilder.toString());
            content.getParts().add(part);
            request.getContents().add(content);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<GeminiRequest> entity = new HttpEntity<>(request, headers);

            String url = GEMINI_API_URL + geminiApiKey;

            try {
                GeminiResponse response = restTemplate.postForObject(url, entity, GeminiResponse.class);
                if (response != null && response.getCandidates() != null && !response.getCandidates().isEmpty()) {
                    String responseText = response.getCandidates().get(0).getContent().getParts().get(0).getText();
                    // Parse IDs
                    List<Long> recommendedIds = Arrays.stream(responseText.split(","))
                            .map(String::trim)
                            .filter(s -> !s.isEmpty() && s.matches("\\d+"))
                            .map(Long::parseLong)
                            .collect(Collectors.toList());

                    // Step 5: Fetch product details
                    if (!recommendedIds.isEmpty()) {
                        recommendations = productRepo.findAllById(recommendedIds);
                    }
                }
            } catch (Exception e) {
                System.err.println("Gemini API call failed: " + e.getMessage());
            }
        } else {
            System.err.println("Gemini API Key is missing. Using fallback recommendations.");
        }
        
        // Fallback if no recommendations could be generated
        if (recommendations.isEmpty()) {
            recommendations = getFallbackRecommendations(currentProduct, allProducts);
        }

        return recommendations;
    }

    private List<Product> getFallbackRecommendations(Product currentProduct, List<Product> allProducts) {
        if (currentProduct != null && currentProduct.getCategory() != null) {
            List<Product> sameCategory = allProducts.stream()
                    .filter(p -> p.getCategory() != null && 
                                 p.getCategory().getId().equals(currentProduct.getCategory().getId()) &&
                                 !p.getId().equals(currentProduct.getId()))
                    .limit(6)
                    .collect(Collectors.toList());
            if (sameCategory.size() >= 4) { // At least 4 from same category
                return sameCategory;
            }
        }
        
        // If not enough in same category or no current product context, just return some products
        return allProducts.stream()
                .filter(p -> currentProduct == null || !p.getId().equals(currentProduct.getId()))
                .limit(6)
                .collect(Collectors.toList());
    }
}
