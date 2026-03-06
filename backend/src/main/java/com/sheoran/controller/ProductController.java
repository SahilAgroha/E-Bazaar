package com.sheoran.controller;

import com.sheoran.exceptions.ProductException;
import com.sheoran.model.Product;
import com.sheoran.repository.ProductRepo;
import com.sheoran.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping("/{productId}")   // 3
    public ResponseEntity<Product> getProductById(@PathVariable Long productId) throws ProductException {
        Product product=productService.findProductById(productId);
        return new ResponseEntity<>(product, HttpStatus.OK);
    }

    @GetMapping("/search")    //  2
    public ResponseEntity<List<Product>> searchProduct(@RequestParam(required = false) String query){
        List<Product> products=productService.searchProducts(query);
        return new ResponseEntity<>(products,HttpStatus.OK);
    }

    @GetMapping   //   1
    public ResponseEntity<Page<Product>> getAllProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String color,
            @RequestParam(required = false) String size,
            @RequestParam(required = false) Integer minPrice,
            @RequestParam(required = false) Integer maxPrice,
            @RequestParam(required = false) Integer minDiscount,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) String stock,
            @RequestParam(defaultValue = "0") Integer pageNumber
            ){

        System.out.println("Categoty "+category);
        System.out.println("Brand "+brand);
        System.out.println("Color "+color);
        System.out.println("Size "+size);
        System.out.println("Min Price "+minPrice);
        System.out.println("Max Price "+maxPrice);
        System.out.println("minDiscount "+minDiscount);
        System.out.println("Sort "+sort);
        System.out.println("Stock "+stock);
        System.out.println("Page Number "+pageNumber);

        BigDecimal min = minPrice != null ? BigDecimal.valueOf(minPrice) : null;
        BigDecimal max = maxPrice != null ? BigDecimal.valueOf(maxPrice) : null;
        return new ResponseEntity<>(
                productService.getAllProducts(category,brand,color,size, min,max,
                        minDiscount,sort,stock,pageNumber),HttpStatus.OK);

    }

}
