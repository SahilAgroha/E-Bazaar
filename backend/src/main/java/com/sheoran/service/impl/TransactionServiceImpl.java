package com.sheoran.service.impl;

import com.sheoran.model.Order;
import com.sheoran.model.Seller;
import com.sheoran.model.SellerReport;
import com.sheoran.model.Transaction;
import com.sheoran.repository.SellerRepo;
import com.sheoran.repository.TransactionRepo;
import com.sheoran.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionServiceImpl implements TransactionService {

    @Autowired
    private TransactionRepo transactionRepo;
    @Autowired
    private SellerRepo sellerRepo;

    @Override
    public Transaction createTransaction(Order order) {
        Seller seller=sellerRepo.findById(order.getSellerId()).get();

        Transaction transaction=new Transaction();
        transaction.setSeller(seller);
        transaction.setCustomer(order.getUser());
        transaction.setOrder(order);
        return transactionRepo.save(transaction);
    }

    @Override
    public List<Transaction> getTransactionBySeller(Seller seller) {
        return transactionRepo.findBySellerId(seller.getId());
    }

    @Override
    public List<Transaction> getAllTransaction() {
        return transactionRepo.findAll();
    }
}
