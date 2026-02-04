package com.sheoran.service.impl;

import com.sheoran.model.HomeCategory;
import com.sheoran.repository.HomeCategoryRepo;
import com.sheoran.service.HomeCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HomeCategoryServiceImpl implements HomeCategoryService {
    @Autowired
    private HomeCategoryRepo homeCategoryRepo;


    @Override
    public HomeCategory createHomeCategory(HomeCategory homeCategory) {
        return homeCategoryRepo.save(homeCategory);
    }

    @Override
    public List<HomeCategory> createHomeCategories(List<HomeCategory> categories) {
        if (homeCategoryRepo.findAll().isEmpty()){
            return homeCategoryRepo.saveAll(categories);
        }
        return homeCategoryRepo.findAll();
    }

    @Override
    public HomeCategory updateHomeCategory(HomeCategory homeCategory, Long id) throws Exception {
        HomeCategory existingCategory=homeCategoryRepo.findById(id).orElseThrow(()->
                new Exception("Category not found"));
        if (homeCategory.getImage()!=null){
            existingCategory.setName(homeCategory.getImage());
        }
        if (homeCategory.getCategoryId()!=null){
            existingCategory.setCategoryId(homeCategory.getCategoryId());
        }
        return homeCategoryRepo.save(existingCategory);
    }

    @Override
    public List<HomeCategory> getAllHomeCategories() {
        return homeCategoryRepo.findAll();
    }
}
