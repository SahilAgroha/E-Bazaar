package com.sheoran.controller;

import com.sheoran.model.Home;
import com.sheoran.model.HomeCategory;
import com.sheoran.service.HomeCategoryService;
import com.sheoran.service.HomeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/")
public class HomeCategoryController {
    @Autowired
    private HomeCategoryService homeCategoryService;
    @Autowired
    private HomeService homeService;

    @PostMapping("/home/categories")
    public ResponseEntity<Home> createHomeCategories(@RequestBody List<HomeCategory> homeCategories){

        List<HomeCategory> categories=homeCategoryService.createHomeCategories(homeCategories);
        Home home=homeService.createHomePageData(categories);
        return new ResponseEntity<>(home, HttpStatus.ACCEPTED);
    }

    @GetMapping("/admin/home-category")
    public ResponseEntity<List<HomeCategory>> getHomeCategory(){
        List<HomeCategory> categories=homeCategoryService.getAllHomeCategories();
        return new ResponseEntity<>(categories,HttpStatus.OK);
    }

    @PatchMapping("/admin/home-category/{id}")
    public ResponseEntity<HomeCategory> updateHomeCategory(@PathVariable Long id,
                                                                 @RequestBody HomeCategory homeCategory) throws Exception {
        HomeCategory updatedCategory=homeCategoryService.updateHomeCategory(homeCategory,id);
        return new ResponseEntity<>(updatedCategory,HttpStatus.OK);
    }
}
