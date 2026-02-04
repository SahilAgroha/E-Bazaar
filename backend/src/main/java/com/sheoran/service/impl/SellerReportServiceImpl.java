package com.sheoran.service.impl;

import com.sheoran.model.Seller;
import com.sheoran.model.SellerReport;
import com.sheoran.repository.SellerReportRepo;
import com.sheoran.service.SellerReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SellerReportServiceImpl implements SellerReportService {
    @Autowired
    private SellerReportRepo sellerReportRepo;


    @Override
    public SellerReport getSellerReport(Seller seller) {
        SellerReport sellerReport=sellerReportRepo.findBySellerId(seller.getId());
        if (sellerReport==null){
            SellerReport newReport=new SellerReport();
            newReport.setSeller(seller);
            return sellerReportRepo.save(newReport);
        }
        return sellerReport;
    }

    @Override
    public SellerReport updateSellerReport(SellerReport sellerReport) {
        return sellerReportRepo.save(sellerReport);
    }
}
