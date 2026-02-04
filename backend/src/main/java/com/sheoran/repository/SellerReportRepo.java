package com.sheoran.repository;

import com.sheoran.model.SellerReport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SellerReportRepo extends JpaRepository<SellerReport,Long> {
    SellerReport findBySellerId(Long sellerId);
}
