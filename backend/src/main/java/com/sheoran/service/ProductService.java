package com.sheoran.service;

import com.sheoran.exceptions.ProductException;
import com.sheoran.model.Product;
import com.sheoran.model.Seller;
import com.sheoran.request.CreateProductRequest;
import org.springframework.data.domain.Page;


import java.util.List;

public interface ProductService {

    Product createProduct(CreateProductRequest request, Seller seller) throws IllegalAccessException;
    void deleteProduct(Long productId) throws ProductException;
    Product updateProduct(Long productId,Product product) throws ProductException;
    Product findProductById(Long productId) throws ProductException;
    List<Product> searchProducts(String query);
    Page<Product> getAllProducts(
            String category,
            String brand,
            String colors,
            String size,
            Integer minPrice,
            Integer maxPrice,
            Integer minDiscount,
            String sort,
            String stock,
            Integer pageNumber
    );
    List<Product> getProductBySellerId(Long sellerId);
}
