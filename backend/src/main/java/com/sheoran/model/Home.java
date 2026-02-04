package com.sheoran.model;

import lombok.Data;

import java.util.List;

@Data
public class Home {

    private List<HomeCategory> grid;

    private List<HomeCategory> shopByCategories;

    private List<HomeCategory> electricCategories;

    private List<HomeCategory> dealCategories;

    private List<Deal> deals;

    public Home(List<HomeCategory> grid, List<HomeCategory> shopByCategories, List<HomeCategory> electricCategories, List<HomeCategory> dealCategories, List<Deal> deals) {
        this.grid = grid;
        this.shopByCategories = shopByCategories;
        this.electricCategories = electricCategories;
        this.dealCategories = dealCategories;
        this.deals = deals;
    }

    public Home() {
    }

    public List<HomeCategory> getGrid() {
        return grid;
    }

    public void setGrid(List<HomeCategory> grid) {
        this.grid = grid;
    }

    public List<HomeCategory> getShopByCategories() {
        return shopByCategories;
    }

    public void setShopByCategories(List<HomeCategory> shopByCategories) {
        this.shopByCategories = shopByCategories;
    }

    public List<HomeCategory> getElectricCategories() {
        return electricCategories;
    }

    public void setElectricCategories(List<HomeCategory> electricCategories) {
        this.electricCategories = electricCategories;
    }

    public List<HomeCategory> getDealCategories() {
        return dealCategories;
    }

    public void setDealCategories(List<HomeCategory> dealCategories) {
        this.dealCategories = dealCategories;
    }

    public List<Deal> getDeals() {
        return deals;
    }

    public void setDeals(List<Deal> deals) {
        this.deals = deals;
    }
}
