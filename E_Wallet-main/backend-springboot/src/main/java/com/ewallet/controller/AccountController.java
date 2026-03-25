package com.ewallet.controller;

import com.ewallet.model.BankAccount;
import com.ewallet.model.User;
import com.ewallet.repository.AccountRepository;
import com.ewallet.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/accounts")
@CrossOrigin
public class AccountController {

    @Autowired
    private AccountRepository repo;

    @Autowired
    private UserRepository userRepository;

    // GET accounts
    @GetMapping("/{userId}")
    public List<BankAccount> getAccounts(@PathVariable Long userId) {
        return repo.findByUserId(userId);
    }

    // ADD account
    @PostMapping
    public BankAccount addAccount(@RequestBody BankAccount account) {

        System.out.println("ADD ACCOUNT CONTROLLER HIT");

        // 🔍 Debug incoming data
        System.out.println("Bank: " + account.getBankName());
        System.out.println("Card: " + account.getCardNumber());
        System.out.println("Holder: " + account.getAccountHolder());
        System.out.println("Balance: " + account.getBalance());
        System.out.println("UserId: " + account.getUserId());

        // ❌ Prevent bad request
        if (account.getUserId() == null) {
            throw new RuntimeException("UserId is required");
        }

        try {
            return repo.save(account);
        } catch (Exception e) {
            e.printStackTrace(); // 🔥 shows real error
            throw e;
        }
    }
    @DeleteMapping("/{id}")
    public void deleteAccount(@PathVariable Long id) {
        repo.deleteById(id);
    }
    @PutMapping("/{id}")
    public BankAccount updateAccount(@PathVariable Long id, @RequestBody BankAccount updated) {

        BankAccount acc = repo.findById(id).orElseThrow();

        acc.setBankName(updated.getBankName());
        acc.setAccountHolder(updated.getAccountHolder());
        acc.setBalance(updated.getBalance());

        return repo.save(acc);
    }
}