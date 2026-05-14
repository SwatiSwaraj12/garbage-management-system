package com.garbage.service;

import com.garbage.model.User;
import com.garbage.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

/**
 * UserService: Business logic for user management (Admin operations).
 */
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    /**
     * Get all registered users (Admin view).
     */
    public List<Map<String, Object>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return convertToResponseList(users);
    }

    /**
     * Get a single user by ID.
     */
    public Map<String, Object> getUserById(Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) return null;
        return convertToResponse(user);
    }

    /**
     * Toggle user active/inactive status (Admin).
     */
    public Map<String, Object> toggleUserStatus(Long userId) {
        Map<String, Object> response = new HashMap<>();
        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            response.put("success", false);
            response.put("message", "User not found.");
            return response;
        }

        user.setActive(!user.getActive()); // Toggle status
        userRepository.save(user);

        response.put("success", true);
        response.put("message", "User status updated: " + (user.getActive() ? "Active" : "Inactive"));
        response.put("isActive", user.getActive());
        return response;
    }

    // ─────────────────────────────
    // HELPER
    // ─────────────────────────────

    private Map<String, Object> convertToResponse(User user) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", user.getId());
        map.put("name", user.getName());
        map.put("email", user.getEmail());
        map.put("phone", user.getPhone());
        map.put("address", user.getAddress());
        map.put("role", user.getRole().name());
        map.put("isActive", user.getActive());
        map.put("createdAt", user.getCreatedAt());
        // NOTE: Never expose password in API responses!
        return map;
    }

    private List<Map<String, Object>> convertToResponseList(List<User> users) {
        List<Map<String, Object>> result = new ArrayList<>();
        for (User u : users) result.add(convertToResponse(u));
        return result;
    }
}
