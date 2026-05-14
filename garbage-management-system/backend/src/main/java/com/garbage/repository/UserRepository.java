package com.garbage.repository;

import com.garbage.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
 import java.util.List;

/**
 * UserRepository: Spring Data JPA interface for User database operations.
 * Spring auto-generates all CRUD SQL queries — no manual SQL needed!
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Find user by email (used during login)
     User findByEmail(String email);
    // Check if email already exists (used during registration)
    boolean existsByEmail(String email);

    // Find all active users
    List<User> findByActive(Boolean active);

    // Find all users with a specific role
    List<User> findByRole(User.Role role);
}
