package com.sheoran.service.impl;

import com.sheoran.model.Deal;
import com.sheoran.model.HomeCategory;
import com.sheoran.repository.DealRepo;
import com.sheoran.repository.HomeCategoryRepo;
import com.sheoran.service.DealService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DealServiceImpl implements DealService {
    @Autowired
    private DealRepo dealRepo;
    @Autowired
    private HomeCategoryRepo homeCategoryRepo;

    @Override
    public List<Deal> getDeals() {
        return dealRepo.findAll();
    }

    @Override
    public Deal createDeal(Deal deal) {
        HomeCategory category=homeCategoryRepo.findById(deal.getCategory().getId()).orElse(null);
        Deal newDeal=dealRepo.save(deal);
        newDeal.setCategory(category);
        newDeal.setDiscount(deal.getDiscount());
        return dealRepo.save(newDeal);
    }

    @Override
    public Deal updateDeal(Deal deal,Long id) throws Exception {
        Deal existingDeal=dealRepo.findById(id).orElse(null);
        HomeCategory category=homeCategoryRepo.findById(deal.getCategory().getId()).orElse(null);
        if (existingDeal!=null){
            if (deal.getDiscount()!=null){
                existingDeal.setDiscount(deal.getDiscount());
            }
            if (category!=null){
                existingDeal.setCategory(category);
            }
            return dealRepo.save(existingDeal);
        }
        throw new Exception("Deal not found");
    }

    @Override
    public void deleteDeal(Long id) throws Exception {
        Deal deal=dealRepo.findById(id).orElseThrow(()->
                new Exception("deal not found"));
        dealRepo.delete(deal);
    }
}
