package com.sheoran.service;

import com.sheoran.model.Seller;
import com.sheoran.model.SellerReport;

public interface SellerReportService {

    SellerReport getSellerReport(Seller seller);
    SellerReport updateSellerReport(SellerReport sellerReport);
}
