package com.sheoran.controller;

import com.sheoran.model.Home;
import com.sheoran.model.HomeCategory;
import com.sheoran.service.HomeCategoryService;
import com.sheoran.service.HomeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/home-category")
public class HomeCategoryController {

    private static final Logger log = LoggerFactory.getLogger(HomeCategoryController.class);

    @Autowired
    private HomeCategoryService homeCategoryService;

    @Autowired
    private HomeService homeService;


    // GET HOME PAGE DATA
    @GetMapping  //   1
    public ResponseEntity<Home> getHomePageData() {

        List<HomeCategory> categories = homeCategoryService.getAllHomeCategories();
        Home home = homeService.createHomePageData(categories);

        return ResponseEntity.ok(home);
    }


    // CREATE MULTIPLE HOME CATEGORIES
    @PostMapping    //   2
    public ResponseEntity<Home> createHomeCategories(
            @RequestBody List<HomeCategory> homeCategories) {

        List<HomeCategory> savedCategories =
                homeCategoryService.createHomeCategories(homeCategories);

        Home home = homeService.createHomePageData(savedCategories);

        return ResponseEntity.ok(home);
    }


    // UPDATE CATEGORY
    @PatchMapping("/{id}")   //   3
    public ResponseEntity<Home> updateHomeCategory(
            @PathVariable Long id,
            @RequestBody HomeCategory homeCategory) throws Exception {

        homeCategoryService.updateHomeCategory(homeCategory, id);

        List<HomeCategory> categories = homeCategoryService.getAllHomeCategories();

        Home home = homeService.createHomePageData(categories);

        return ResponseEntity.ok(home);
    }


    // DELETE CATEGORY
    @DeleteMapping("/{id}")    //    4
    public ResponseEntity<Home> deleteHomeCategory(@PathVariable Long id) throws Exception {

        homeCategoryService.deleteHomeCategory(id);

        List<HomeCategory> categories = homeCategoryService.getAllHomeCategories();

        Home home = homeService.createHomePageData(categories);

        return ResponseEntity.ok(home);
    }
}