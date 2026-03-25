package com.ewallet.controller;

import com.ewallet.model.Transaction;
import com.ewallet.repository.TransactionRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transactions")
@CrossOrigin(origins = "http://localhost:5173")
public class TransactionController {

    private final TransactionRepository transactionRepository;

    public TransactionController(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    // ✅ GET ALL TRANSACTIONS FOR USER
    @GetMapping("/{userId}")
    public List<Transaction> getTransactions(@PathVariable Long userId) {
        return transactionRepository.findBySenderOrReceiver(userId, userId);
    }
}