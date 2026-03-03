package com.sheoran.service.impl;

import com.sheoran.exceptions.ProductException;
import com.sheoran.model.Category;
import com.sheoran.model.Product;
import com.sheoran.model.Seller;
import com.sheoran.repository.CategoryRepo;
import com.sheoran.repository.ProductRepo;
import com.sheoran.request.CreateProductRequest;
import com.sheoran.service.ProductService;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
//@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepo productRepo;
    @Autowired
    private CategoryRepo categoryRepo;

    @Override
    public Product createProduct(CreateProductRequest request, Seller seller)
            throws IllegalAccessException {

        Category category3 = resolveCategoryHierarchy(request);

        int discountPercentage =
                calculateDiscountPercentage(
                        request.getMrpPrice(),
                        request.getSellingPrice()
                );

        Product product = new Product();
        product.setSeller(seller);
        product.setCategory(category3);
        product.setDescription(request.getDescription());
        product.setTitle(request.getTitle());
        product.setCreatedAt(LocalDateTime.now());
        product.setColor(request.getColor());
        product.setSellingPrice(request.getSellingPrice());
        product.setMrpPrice(request.getMrpPrice());
        product.setImages(request.getImages());
        product.setSizes(request.getSize());
        product.setQuantity(request.getQuantity());
        product.setDiscountPercentage(discountPercentage);

        return productRepo.save(product);
    }

    private Category resolveCategoryHierarchy(CreateProductRequest request) {

        // LEVEL 1
        Category level1 = categoryRepo.findByCategoryId(request.getCategory());
        if (level1 == null) {
            level1 = new Category();
            level1.setCategoryId(request.getCategory());
            level1.setName(request.getCategory()); // REQUIRED (not null)
            level1.setLevel(1);
            level1 = categoryRepo.save(level1);
        }

        // LEVEL 2
        Category level2 = categoryRepo.findByCategoryId(request.getCategory2());
        if (level2 == null) {
            level2 = new Category();
            level2.setCategoryId(request.getCategory2());
            level2.setName(request.getCategory2()); // REQUIRED
            level2.setLevel(2);
            level2.setPatentCategory(level1);
            level2 = categoryRepo.save(level2);
        }

        // LEVEL 3
        Category level3 = categoryRepo.findByCategoryId(request.getCategory3());
        if (level3 == null) {
            level3 = new Category();
            level3.setCategoryId(request.getCategory3());
            level3.setName(request.getCategory3()); // REQUIRED
            level3.setLevel(3);
            level3.setPatentCategory(level2);
            level3 = categoryRepo.save(level3);
        }

        return level3;
    }

    private int calculateDiscountPercentage(
            BigDecimal mrpPrice,
            BigDecimal sellingPrice
    ) throws IllegalAccessException {

        if (mrpPrice.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalAccessException(
                    "Actual price must be greater than 0"
            );
        }

        BigDecimal discount =
                mrpPrice.subtract(sellingPrice);

        BigDecimal percentage =
                discount.multiply(BigDecimal.valueOf(100))
                        .divide(mrpPrice, 2, RoundingMode.HALF_UP);

        return percentage.intValue();
    }

    @Override
    public void deleteProduct(Long productId)
            throws ProductException {

        Product product = findProductById(productId);
        productRepo.delete(product);
    }

    @Override
    public Product updateProduct(Long productId, Product updatedProduct)
            throws ProductException {

        Product existing = findProductById(productId);

        if (updatedProduct.getTitle() != null)
            existing.setTitle(updatedProduct.getTitle());

        if (updatedProduct.getDescription() != null)
            existing.setDescription(updatedProduct.getDescription());

        if (updatedProduct.getMrpPrice() != null)
            existing.setMrpPrice(updatedProduct.getMrpPrice());

        if (updatedProduct.getSellingPrice() != null)
            existing.setSellingPrice(updatedProduct.getSellingPrice());

        if (updatedProduct.getQuantity() != null)
            existing.setQuantity(updatedProduct.getQuantity());

        if (updatedProduct.getColor() != null)
            existing.setColor(updatedProduct.getColor());

        if (updatedProduct.getImages() != null)
            existing.setImages(updatedProduct.getImages());

        if (updatedProduct.getSizes() != null)
            existing.setSizes(updatedProduct.getSizes());

        // Recalculate discount if price changed
        if (updatedProduct.getMrpPrice() != null || updatedProduct.getSellingPrice() != null) {
            try {
                int discount = calculateDiscountPercentage(
                        existing.getMrpPrice(),
                        existing.getSellingPrice()
                );
                existing.setDiscountPercentage(discount);
            } catch (IllegalAccessException e) {
                throw new ProductException(e.getMessage());
            }
        }

        return productRepo.save(existing);
    }

    @Override
    public Product findProductById(Long productId)
            throws ProductException {

        return productRepo.findById(productId)
                .orElseThrow(() ->
                        new ProductException(
                                "Product not found with id " + productId
                        ));
    }

    @Override
    public List<Product> searchProducts(String query) {
        return productRepo.searchProduct(query);
    }

    @Override
    public Page<Product> getAllProducts(
            String category,
            String brand,
            String colors,
            String size,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Integer minDiscount,
            String sort,
            String stock,
            Integer pageNumber
    ) {

        Specification<Product> specification =
                (root, query, cb) -> {

                    List<Predicate> predicates = new ArrayList<>();

                    if (category != null) {
                        Join<Product, Category> join =
                                root.join("category");
                        predicates.add(
                                cb.equal(join.get("categoryId"), category)
                        );
                    }

                    if (colors != null) {
                        predicates.add(
                                cb.equal(root.get("color"), colors)
                        );
                    }

                    if (size != null) {
                        predicates.add(
                                cb.equal(root.get("sizes"), size)
                        );
                    }

                    if (minPrice != null) {
                        predicates.add(
                                cb.greaterThanOrEqualTo(
                                        root.get("sellingPrice"),
                                        minPrice
                                )
                        );
                    }

                    if (maxPrice != null) {
                        predicates.add(
                                cb.lessThanOrEqualTo(
                                        root.get("sellingPrice"),
                                        maxPrice
                                )
                        );
                    }

                    if (minDiscount != null) {
                        predicates.add(
                                cb.greaterThanOrEqualTo(
                                        root.get("discountPercentage"),
                                        minDiscount
                                )
                        );
                    }

                    if ("in_stock".equals(stock)) {
                        predicates.add(
                                cb.greaterThan(
                                        root.get("quantity"),
                                        0
                                )
                        );
                    }

                    return cb.and(predicates.toArray(new Predicate[0]));
                };

        Pageable pageable =
                PageRequest.of(
                        pageNumber != null ? pageNumber : 0,
                        10,
                        resolveSort(sort)
                );

        return productRepo.findAll(specification, pageable);
    }

    private Sort resolveSort(String sort) {

        if ("price_low".equals(sort)) {
            return Sort.by("sellingPrice").ascending();
        }

        if ("price_high".equals(sort)) {
            return Sort.by("sellingPrice").descending();
        }

        return Sort.unsorted();
    }

    @Override
    public List<Product> getProductBySellerId(Long sellerId) {
        return productRepo.findBySellerId(sellerId);
    }
}