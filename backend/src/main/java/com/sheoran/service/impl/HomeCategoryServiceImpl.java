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

        List<HomeCategory> existing = homeCategoryRepo.findAll();

        for(HomeCategory newCat : categories){
            boolean alreadyExists = existing.stream()
                    .anyMatch(oldCat -> oldCat.getCategoryId().equals(newCat.getCategoryId())
                            && oldCat.getSection().equals(newCat.getSection()));

            if(!alreadyExists){
                homeCategoryRepo.save(newCat);
            }
        }

        return homeCategoryRepo.findAll();
    }

    @Override
    public HomeCategory updateHomeCategory(HomeCategory homeCategory, Long id) throws Exception {

        HomeCategory existingCategory = homeCategoryRepo.findById(id)
                .orElseThrow(() -> new Exception("Category not found"));

        if (homeCategory.getName() != null) {
            existingCategory.setName(homeCategory.getName());
        }

        if (homeCategory.getImage() != null) {
            existingCategory.setImage(homeCategory.getImage());
        }

        if (homeCategory.getCategoryId() != null) {
            existingCategory.setCategoryId(homeCategory.getCategoryId());
        }

        // ✅ FIX: Update section also
        if (homeCategory.getSection() != null) {
            existingCategory.setSection(homeCategory.getSection());
        }

        return homeCategoryRepo.save(existingCategory);
    }

    @Override
    public List<HomeCategory> getAllHomeCategories() {
        return homeCategoryRepo.findAll();
    }

    @Override
    public void deleteHomeCategory(Long id) throws Exception {

        HomeCategory category = homeCategoryRepo.findById(id)
                .orElseThrow(() -> new Exception("Category not found"));

        homeCategoryRepo.delete(category);
    }
}
