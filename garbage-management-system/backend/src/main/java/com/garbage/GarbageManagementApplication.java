package com.garbage;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for the Garbage Management System Spring Boot application.
 * @SpringBootApplication enables auto-configuration, component scanning, and configuration.
 */
@SpringBootApplication
public class GarbageManagementApplication {
    public static void main(String[] args) {
        SpringApplication.run(GarbageManagementApplication.class, args);
        System.out.println("✅ Garbage Management System Backend Started on http://localhost:8081");
    }
}
