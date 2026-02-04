package com.sheoran.controller;

import com.sheoran.domain.AccountStatus;
import com.sheoran.model.Seller;
import com.sheoran.service.SellerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class AdminController {
    @Autowired
    private SellerService sellerService;

    @PatchMapping("/seller/{id}/status/{status}")
    public ResponseEntity<Seller> updateSellerStatus(@PathVariable Long id,
                                                     @PathVariable AccountStatus status) throws Exception {
        Seller updatedSeller=sellerService.updateSellerAccountStatus(id, status);
        return new ResponseEntity<>(updatedSeller, HttpStatus.OK);
    }
}
