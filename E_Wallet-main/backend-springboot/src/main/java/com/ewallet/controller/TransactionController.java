package com.ewallet.controller;

import com.ewallet.model.Transaction;
import com.ewallet.model.User;
import com.ewallet.repository.TransactionRepository;
import com.ewallet.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transactions")
@CrossOrigin(origins = "http://localhost:5173")
public class TransactionController {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public TransactionController(TransactionRepository transactionRepository, UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    // ✅ GET ALL TRANSACTIONS FOR USER (SECURED VIA JWT)
    @GetMapping
    public ResponseEntity<List<Transaction>> getTransactions(Authentication auth) {
        User user = userRepository.findByUsername(auth.getName());
        List<Transaction> transactions = transactionRepository.findBySenderOrReceiver(user.getId(), user.getId());
        return ResponseEntity.ok(transactions);
    }
}