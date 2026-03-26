package com.ewallet.controller;

import com.ewallet.model.User;
import com.ewallet.model.Wallet;
import com.ewallet.repository.UserRepository;
import com.ewallet.service.WalletService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.Map;

@RestController
@RequestMapping("/wallet")
@CrossOrigin(origins = "http://localhost:5173")
public class WalletController {

    private final WalletService walletService;
    private final UserRepository userRepository;

    public WalletController(WalletService walletService, UserRepository userRepository) {
        this.walletService = walletService;
        this.userRepository = userRepository;
    }

    // ✅ GET BALANCE
    @GetMapping("/balance")
    public ResponseEntity<?> getBalance(Authentication auth) {
        String username = auth.getName();
        User user = userRepository.findByUsername(username);

        Wallet wallet = walletService.getWalletByUserId(user.getId());

        return ResponseEntity.ok(Map.of(
                "balance", wallet.getBalance()
        ));
    }

    // ✅ ADD MONEY (DIRECT)
    @PostMapping("/add")
    public ResponseEntity<?> addMoney(
            Authentication auth,
            @RequestBody Map<String, Double> body) {
        try {
            User user = userRepository.findByUsername(auth.getName());
            Double amount = body.get("amount");
            walletService.addMoneyDirect(user.getId(), amount);

            return ResponseEntity.ok(Map.of(
                    "message", "Money added",
                    "balance", walletService.getWalletByUserId(user.getId()).getBalance()
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ✅ ADD FROM BANK ACCOUNT
    @PostMapping("/add-from-account")
    public ResponseEntity<?> addFromAccount(
            Authentication auth,
            @RequestBody Map<String, Object> body) {
        try {
            User user = userRepository.findByUsername(auth.getName());
            Long accountId = Long.valueOf(body.get("accountId").toString());
            Double amount = Double.valueOf(body.get("amount").toString());

            walletService.addFromAccount(user.getId(), accountId, amount);

            return ResponseEntity.ok(Map.of(
                    "message", "Wallet funded successfully",
                    "walletBalance", walletService.getWalletByUserId(user.getId()).getBalance()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage()));
        }
    }

    // ✅ SELF TRANSFER (BANK TO BANK)
    @PostMapping("/transfer/self")
    public ResponseEntity<?> selfTransfer(Authentication auth, @RequestBody Map<String, Object> body) {
        try {
            User user = userRepository.findByUsername(auth.getName());
            Long fromId = Long.valueOf(body.get("fromAccountId").toString());
            Long toId = Long.valueOf(body.get("toAccountId").toString());
            Double amount = Double.valueOf(body.get("amount").toString());

            walletService.selfTransfer(user.getId(), fromId, toId, amount);
            
            return ResponseEntity.ok(Map.of("message", "Self-transfer successful"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage()));
        }
    }

    // 🚀 NEW: P2P WALLET TRANSFER
    @PostMapping("/transfer/user")
    public ResponseEntity<?> transferToUser(Authentication auth, @RequestBody Map<String, Object> body) {
        try {
            User user = userRepository.findByUsername(auth.getName());
            String receiverUsername = body.get("receiverUsername").toString();
            Double amount = Double.valueOf(body.get("amount").toString());

            walletService.transferWalletToWallet(user.getId(), receiverUsername, amount);

            return ResponseEntity.ok(Map.of("message", "Funds transferred successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage()));
        }
    }

    // 🚀 NEW: WITHDRAW TO BANK
    @PostMapping("/withdraw")
    public ResponseEntity<?> withdrawToBank(Authentication auth, @RequestBody Map<String, Object> body) {
        try {
            User user = userRepository.findByUsername(auth.getName());
            Long accountId = Long.valueOf(body.get("accountId").toString());
            Double amount = Double.valueOf(body.get("amount").toString());

            walletService.withdrawToBank(user.getId(), accountId, amount);

            return ResponseEntity.ok(Map.of(
                "message", "Withdrawal successful",
                "walletBalance", walletService.getWalletByUserId(user.getId()).getBalance()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage()));
        }
    }
}