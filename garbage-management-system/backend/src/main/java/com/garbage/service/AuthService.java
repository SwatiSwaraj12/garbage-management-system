 package com.garbage.service;

import com.garbage.config.JwtUtil;
import com.garbage.model.User;
import com.garbage.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * AuthService: Handles user registration and login logic.
 */
@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // ================= REGISTER =================
    public Map<String, Object> register(String name, String email, String password,
                                        String phone, String address) {

        Map<String, Object> response = new HashMap<>();

        try {
            // Check if email already exists
            if (userRepository.existsByEmail(email)) {
                response.put("success", false);
                response.put("message", "Email already registered. Please login.");
                return response;
            }

            // Create new user
            User user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password)); // Encrypt password
            user.setPhone(phone);
            user.setAddress(address);
            user.setRole(User.Role.USER);
            user.setActive(true); // Ensure active is always true

            // Save user
            userRepository.save(user);

            response.put("success", true);
            response.put("message", "Registration successful! Please login.");

        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Registration failed");
        }

        return response;
    }

    // ================= LOGIN =================
    public Map<String, Object> login(String email, String password) {

        Map<String, Object> response = new HashMap<>();

        try {
            // Find user
            User user = userRepository.findByEmail(email);

            // User not found
            if (user == null) {
                response.put("success", false);
                response.put("message", "User not found");
                return response;
            }

            // Check active (safe null check)
            if (user.getActive() == null || !user.getActive()) {
                response.put("success", false);
                response.put("message", "Account is deactivated");
                return response;
            }

            // Check password
            if (!passwordEncoder.matches(password, user.getPassword())) {
                response.put("success", false);
                response.put("message", "Invalid password");
                return response;
            }

            // Generate JWT token
            String token = jwtUtil.generateToken(
                    user.getEmail(),
                    user.getRole().name(),
                        user.getId()

            );

            // Success response
            response.put("success", true);
            response.put("token", token);
            response.put("userId", user.getId());
            response.put("name", user.getName());
            response.put("email", user.getEmail());
            response.put("role", user.getRole().name());
            response.put("message", "Login successful!");

        } catch (Exception e) {
            e.printStackTrace(); // VERY IMPORTANT (shows real error)
            response.put("success", false);
            response.put("message", "Server error");
        }

        return response;
    }
}