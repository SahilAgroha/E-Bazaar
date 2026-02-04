package com.sheoran.service.impl;

import com.sheoran.domain.HomeCategorySection;
import com.sheoran.model.Deal;
import com.sheoran.model.Home;
import com.sheoran.model.HomeCategory;
import com.sheoran.repository.DealRepo;
import com.sheoran.service.HomeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HomeServiceImpl implements HomeService {
    @Autowired
    private DealRepo dealRepo;

    @Override
    public Home createHomePageData(List<HomeCategory> allCategories) {

        List<HomeCategory> gridCategories=allCategories.stream()
                .filter(category->
                        category.getSection()== HomeCategorySection.GRID)
                .toList();

        List<HomeCategory> shopByCategories=allCategories.stream()
                .filter(category->
                        category.getSection()== HomeCategorySection.SHOP_BY_CATEGORIES)
                .toList();

        List<HomeCategory> electricCategories=allCategories.stream()
                .filter(category->
                        category.getSection()== HomeCategorySection.ELECTRIC_CATEGORIES)
                .toList();

        List<HomeCategory> dealCategories=allCategories.stream()
                .filter(category->
                        category.getSection()== HomeCategorySection.DEALS)
                .toList();

        List<Deal> createDeals=new ArrayList<>();

        if (dealRepo.findAll().isEmpty()){
            List<Deal> deals=allCategories.stream()
                    .filter(category->category.getSection()==HomeCategorySection.DEALS)
                    .map(category->new Deal(null,10,category))
                    .toList();
            createDeals=dealRepo.saveAll(deals);
        } else {
            createDeals=dealRepo.findAll();
        }

        Home home=new Home();
        home.setGrid(gridCategories);
        home.setElectricCategories(electricCategories);
        home.setShopByCategories(shopByCategories);
        home.setDeals(createDeals);


        return home;
    }
}
