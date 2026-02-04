package com.sheoran.service;

import com.sheoran.model.Home;
import com.sheoran.model.HomeCategory;

import java.util.List;

public interface HomeService {

    Home createHomePageData(List<HomeCategory> allCategories);

}
