package com.ewallet.controller;

import com.ewallet.jwt.JwtUtil;
import com.ewallet.model.User;
import com.ewallet.model.Wallet;
import com.ewallet.repository.UserRepository;

import com.ewallet.repository.WalletRepository;
import dev.samstevens.totp.qr.QrData;
import dev.samstevens.totp.qr.ZxingPngQrGenerator;
import dev.samstevens.totp.secret.DefaultSecretGenerator;
import dev.samstevens.totp.code.DefaultCodeVerifier;
import dev.samstevens.totp.code.DefaultCodeGenerator;
import dev.samstevens.totp.time.SystemTimeProvider;
import dev.samstevens.totp.code.HashingAlgorithm;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import java.util.Base64;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class ApiController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final WalletRepository walletRepository;


    public ApiController(AuthenticationManager authenticationManager,
                         UserRepository userRepository,
                         PasswordEncoder passwordEncoder,
                         JwtUtil jwtUtil,
                         WalletRepository walletRepo) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.walletRepository = walletRepo ;
    }

    // ✅ SIGNUP
    @PostMapping("/signup")
    public String signup(@RequestBody User user) {

        System.out.println("Name: " + user.getName());
        System.out.println("Email: " + user.getEmail());
        System.out.println("Phone: " + user.getPhone());

        user.setPasskey(passwordEncoder.encode(user.getPasskey()));
        user.setBalance(0.0);
        userRepository.save(user);
        return "User Registered";
    }

    // ✅ LOGIN
    @PostMapping("/auth/login")
    public Map<String, Object> login(@RequestBody User user) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        user.getUsername(),
                        user.getPasskey()
                )
        );

        User dbUser = userRepository.findByUsername(user.getUsername());

        System.out.println("MFA Enabled: " + dbUser.isMfaEnabled());
        System.out.println("User Id: " + dbUser.getId());

        if (dbUser.isMfaEnabled()) {

            String tempToken = jwtUtil.generateToken(user.getUsername());

            return Map.of(
                    "mfaRequired", true,
                    "tempToken", tempToken,
                    "userId", dbUser.getId()
            );
        }

        String token = jwtUtil.generateToken(user.getUsername());

        return Map.of(
                "mfaRequired", false,
                "token", token,
                "userId", dbUser.getId()
        );
    }
    // ✅ ENABLE MFA
    @PostMapping("/auth/enable-mfa")
    public Map<String, String> enableMfa(Authentication auth) throws Exception {

        String username = auth.getName();

        User user = userRepository.findByUsername(username);

        // 🔐 generate secret
        DefaultSecretGenerator secretGenerator = new DefaultSecretGenerator();
        String secret = secretGenerator.generate();

        user.setMfaSecret(secret);
        user.setMfaEnabled(true);
        userRepository.save(user);

        QrData data = new QrData.Builder()
                .label(username)
                .secret(secret)
                .issuer("EWallet")
                .algorithm(HashingAlgorithm.SHA1)
                .digits(6)
                .period(30)
                .build();

        ZxingPngQrGenerator generator = new ZxingPngQrGenerator();
        byte[] imageData = generator.generate(data);

        String qrBase64 = Base64.getEncoder().encodeToString(imageData);

        return Map.of(
                "secret", secret,
                "qrImage", qrBase64
        );
    }

    @PostMapping("/auth/disable-mfa")
    public Map<String, String> disableMfa(Authentication auth) {

        String username = auth.getName();

        User user = userRepository.findByUsername(username);

        user.setMfaEnabled(false);
        user.setMfaSecret(null);

        userRepository.save(user);

        return Map.of("message", "MFA Disabled");
    }

    @GetMapping("/auth/mfa-status")
    public Map<String, Boolean> getMfaStatus(Authentication auth) {

        String username = auth.getName();

        User user = userRepository.findByUsername(username);

        return Map.of("enabled", user.isMfaEnabled());
    }

    // ✅ VERIFY OTP
    @PostMapping("/auth/verify-otp")
    public Map<String, String> verifyOtp(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> req) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing token");
        }


        String token = authHeader.substring(7);
        String username = jwtUtil.extractUsername(token);

        String otp = req.get("otp");

        User user = userRepository.findByUsername(username);

        System.out.println("Secret: " + user.getMfaSecret());
        System.out.println("OTP from user: " + otp);

        DefaultCodeGenerator generator =
                new DefaultCodeGenerator(HashingAlgorithm.SHA1);

        DefaultCodeVerifier verifier =
                new DefaultCodeVerifier(generator, new SystemTimeProvider());

        verifier.setAllowedTimePeriodDiscrepancy(1);

        boolean isValid = verifier.isValidCode(user.getMfaSecret(), otp);

        if (isValid) {
            String finalToken = jwtUtil.generateToken(username);
            return Map.of("token", finalToken);
        }

        throw new RuntimeException("Invalid OTP");
    }



    @PutMapping("/user/change-password")
    public Map<String, Object> changePassword(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody Map<String, String> req) {

        System.out.println("🔥 Change Password API called");

        try {

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return Map.of("message", "Missing token");
            }

            String token = authHeader.substring(7);
            String username = jwtUtil.extractUsername(token);

            System.out.println("User: " + username);

            User user = userRepository.findByUsername(username);

            if (user == null) {
                return Map.of("message", "User not found");
            }

            String current = req.get("currentPassword");
            String newPass = req.get("newPassword");

            if (current == null || newPass == null) {
                return Map.of("message", "Invalid input");
            }

            // 🔥 IMPORTANT FIX
            if (!passwordEncoder.matches(current, user.getPasskey())) {
                return Map.of("message", "Wrong current password");
            }

            user.setPasskey(passwordEncoder.encode(newPass));
            userRepository.save(user);

            return Map.of("message", "Password updated successfully");

        } catch (Exception e) {
            e.printStackTrace();
            return Map.of("message", "Server error");
        }
    }
}