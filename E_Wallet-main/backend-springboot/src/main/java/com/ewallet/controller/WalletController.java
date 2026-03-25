package com.ewallet.controller;

import com.ewallet.model.User;
import com.ewallet.model.Wallet;
import com.ewallet.model.BankAccount;
import com.ewallet.model.Transaction;
import com.ewallet.repository.UserRepository;
import com.ewallet.repository.WalletRepository;
import com.ewallet.repository.AccountRepository;
import com.ewallet.repository.TransactionRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/wallet")
@CrossOrigin(origins = "http://localhost:5173")
public class WalletController {

    private final WalletRepository walletRepository;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    // ✅ FIXED CONSTRUCTOR (IMPORTANT)
    public WalletController(WalletRepository walletRepository,
                            UserRepository userRepository,
                            AccountRepository accountRepository,
                            TransactionRepository transactionRepository) {
        this.walletRepository = walletRepository;
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    // ✅ GET BALANCE
    @GetMapping("/balance")
    public ResponseEntity<?> getBalance(Authentication auth) {

        String username = auth.getName();
        User user = userRepository.findByUsername(username);

        Wallet wallet = walletRepository.findByUserId(user.getId());

        return ResponseEntity.ok(Map.of(
                "balance",
                wallet != null ? wallet.getBalance() : 0.0
        ));
    }

    // ✅ ADD MONEY (DIRECT)
    @PostMapping("/add")
    public ResponseEntity<?> addMoney(
            Authentication auth,
            @RequestBody Map<String, Double> body) {

        String username = auth.getName();
        User user = userRepository.findByUsername(username);

        Double amount = body.get("amount");

        if (amount == null || amount <= 0) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid amount"));
        }

        Wallet wallet = walletRepository.findByUserId(user.getId());

        if (wallet == null) {
            wallet = new Wallet();
            wallet.setUserId(user.getId());
            wallet.setBalance(0.0);
        }

        // 💰 Add money
        wallet.setBalance(wallet.getBalance() + amount);
        walletRepository.save(wallet);

        // 🔥 SAVE TRANSACTION
        Transaction txn = new Transaction();
        txn.setSender(null);
        txn.setReceiver(user.getId());
        txn.setAmount(amount);
        txn.setType("ADD_MONEY");
        txn.setStatus("SUCCESS");
        txn.setDateTime(LocalDateTime.now());

        transactionRepository.save(txn);

        return ResponseEntity.ok(Map.of(
                "message", "Money added",
                "balance", wallet.getBalance()
        ));
    }

    // ✅ ADD FROM BANK ACCOUNT
    @PostMapping("/add-from-account")
    public ResponseEntity<?> addFromAccount(
            Authentication auth,
            @RequestBody Map<String, Object> body) {

        try {
            String username = auth.getName();
            User user = userRepository.findByUsername(username);

            Long accountId = Long.valueOf(body.get("accountId").toString());
            Double amount = Double.valueOf(body.get("amount").toString());

            if (amount <= 0) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Invalid amount"));
            }

            BankAccount account = accountRepository.findById(accountId)
                    .orElseThrow(() -> new RuntimeException("Account not found"));

            if (!account.getUserId().equals(user.getId())) {
                return ResponseEntity.status(403)
                        .body(Map.of("message", "Unauthorized account access"));
            }

            if (account.getBalance() < amount) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Insufficient bank balance"));
            }

            // 🔻 Deduct from bank
            account.setBalance(account.getBalance() - amount);
            accountRepository.save(account);

            // 🔺 Add to wallet
            Wallet wallet = walletRepository.findByUserId(user.getId());

            if (wallet == null) {
                wallet = new Wallet();
                wallet.setUserId(user.getId());
                wallet.setBalance(0.0);
            }

            wallet.setBalance(wallet.getBalance() + amount);
            walletRepository.save(wallet);

            // 🔥 SAVE TRANSACTION
            Transaction txn = new Transaction();
            txn.setSender(account.getUserId());
            txn.setReceiver(user.getId());
            txn.setAmount(amount);
            txn.setType("ADD_FROM_BANK");
            txn.setStatus("SUCCESS");
            txn.setDateTime(LocalDateTime.now());

            transactionRepository.save(txn);

            return ResponseEntity.ok(Map.of(
                    "walletBalance", wallet.getBalance(),
                    "bankBalance", account.getBalance()
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "message", "Error: " + e.getMessage()
            ));
        }
    }

    // ✅ SELF TRANSFER
    @PostMapping("/transfer/self")
    public ResponseEntity<?> selfTransfer(@RequestBody Map<String, Object> body) {

        Long fromId = Long.valueOf(body.get("fromAccountId").toString());
        Long toId = Long.valueOf(body.get("toAccountId").toString());
        Double amount = Double.valueOf(body.get("amount").toString());

        BankAccount from = accountRepository.findById(fromId).orElseThrow();
        BankAccount to = accountRepository.findById(toId).orElseThrow();

        if (from.getBalance() < amount) {
            return ResponseEntity.badRequest().body(Map.of("message", "Insufficient balance"));
        }

        from.setBalance(from.getBalance() - amount);
        to.setBalance(to.getBalance() + amount);

        accountRepository.save(from);
        accountRepository.save(to);

        // 🔥 SAVE TRANSACTION
        Transaction txn = new Transaction();
        txn.setSender(from.getUserId());
        txn.setReceiver(to.getUserId());
        txn.setAmount(amount);
        txn.setType("SELF_TRANSFER");
        txn.setStatus("SUCCESS");
        txn.setDateTime(LocalDateTime.now());

        transactionRepository.save(txn);

        return ResponseEntity.ok(Map.of("message", "Transfer successful"));
    }
}