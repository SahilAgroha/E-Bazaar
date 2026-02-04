package com.sheoran.service;

import com.sheoran.model.Order;
import com.sheoran.model.Seller;
import com.sheoran.model.Transaction;

import java.util.List;

public interface TransactionService {

    Transaction createTransaction(Order order);
    List<Transaction> getTransactionBySeller(Seller seller);
    List<Transaction> getAllTransaction();
}
