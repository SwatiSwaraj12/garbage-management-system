 package com.garbage.controller;

import com.garbage.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000") // ✅ allow frontend
public class AuthController {

    @Autowired
    private AuthService authService;

    // ================= REGISTER =================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {

        if (request.get("email") == null || request.get("password") == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Email and password are required"
            ));
        }

        Map<String, Object> response = authService.register(
                request.get("name"),
                request.get("email"),
                request.get("password"),
                request.get("phone"),
                request.get("address")
        );

        return ResponseEntity.ok(response);
    }

    // ================= LOGIN =================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {

        if (request.get("email") == null || request.get("password") == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Email and password are required"
            ));
        }

        Map<String, Object> response = authService.login(
                request.get("email"),
                request.get("password")
        );

        // ✅ IMPORTANT: if login fails → return 401
        if (response.get("success") != null && response.get("success").equals(false)) {
            return ResponseEntity.status(401).body(response);
        }

        return ResponseEntity.ok(response);
    }
}