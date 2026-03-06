package com.sheoran.controller;

import com.sheoran.model.Deal;
import com.sheoran.response.ApiResponse;
import com.sheoran.service.DealService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/deals")
public class DealController {

    @Autowired
    private DealService dealService;

    // ✅ GET ALL DEALS
    @GetMapping    //   1
    public ResponseEntity<List<Deal>> getAllDeals(){
        List<Deal> deals = dealService.getAllDeals();
        return new ResponseEntity<>(deals, HttpStatus.OK);
    }

    // ✅ CREATE DEAL
    @PostMapping   //    2
    public ResponseEntity<Deal> createDeals(@RequestBody Deal deal){
        Deal createdDeal = dealService.createDeal(deal);
        return new ResponseEntity<>(createdDeal, HttpStatus.ACCEPTED);
    }

    // ✅ UPDATE DEAL
    @PatchMapping("/{id}")   //    3
    public ResponseEntity<Deal> updateDeal(@PathVariable Long id,
                                           @RequestBody Deal deal) throws Exception {

        Deal updatedDeal = dealService.updateDeal(deal,id);
        return new ResponseEntity<>(updatedDeal,HttpStatus.OK);
    }

    // ✅ DELETE DEAL
    @DeleteMapping("/{id}")   //   4
    public ResponseEntity<ApiResponse> deleteDeal(@PathVariable Long id) throws Exception {
        dealService.deleteDeal(id); // ⚠️ you forgot to call service
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setMessage("Deal deleted");

        return new ResponseEntity<>(apiResponse,HttpStatus.ACCEPTED);
    }
}