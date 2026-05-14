 package com.garbage.config;

import com.garbage.model.User;
import com.garbage.model.WasteType;
import com.garbage.repository.UserRepository;
import com.garbage.repository.WasteTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WasteTypeRepository wasteTypeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedWasteTypes();
        seedAdminUser();
        System.out.println("✅ Sample data seeded successfully!");
    }

    private void seedWasteTypes() {

        if (wasteTypeRepository.count() == 0) {

            WasteType wt1 = new WasteType();
            wt1.setName("Wet Waste");
            wt1.setDescription("Food scraps, vegetable peels, leftover food, tea bags");
            wt1.setColor("#4CAF50");
            wt1.setIcon("droplet");
            wt1.setActive(true);
            wasteTypeRepository.save(wt1);

            WasteType wt2 = new WasteType();
            wt2.setName("Dry Waste");
            wt2.setDescription("Paper, cardboard, plastic bottles, glass, metal cans");
            wt2.setColor("#2196F3");
            wt2.setIcon("recycle");
            wt2.setActive(true);
            wasteTypeRepository.save(wt2);

            WasteType wt3 = new WasteType();
            wt3.setName("Medical Waste");
            wt3.setDescription("Syringes, medicines, bandages, hospital waste");
            wt3.setColor("#F44336");
            wt3.setIcon("hospital");
            wt3.setActive(true);
            wasteTypeRepository.save(wt3);

            WasteType wt4 = new WasteType();
            wt4.setName("Electronic Waste");
            wt4.setDescription("Old phones, computers, batteries, cables");
            wt4.setColor("#FF9800");
            wt4.setIcon("zap");
            wt4.setActive(true);
            wasteTypeRepository.save(wt4);

            WasteType wt5 = new WasteType();
            wt5.setName("Hazardous Waste");
            wt5.setDescription("Chemicals, paint, pesticides, motor oil");
            wt5.setColor("#9C27B0");
            wt5.setIcon("alert-triangle");
            wt5.setActive(true);
            wasteTypeRepository.save(wt5);

            WasteType wt6 = new WasteType();
            wt6.setName("Construction Waste");
            wt6.setDescription("Bricks, cement, wood scraps, tiles");
            wt6.setColor("#795548");
            wt6.setIcon("hard-hat");
            wt6.setActive(true);
            wasteTypeRepository.save(wt6);

            System.out.println("✅ Waste types seeded.");
        }
    }

    private void seedAdminUser() {

        if (!userRepository.existsByEmail("admin@garbage.com")) {

            User admin = new User();
            admin.setName("System Admin");
            admin.setEmail("admin@garbage.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setPhone("9999999999");
            admin.setAddress("Municipal Corporation Office, City Center");
            admin.setRole(User.Role.ADMIN);
            admin.setActive(true);

            userRepository.save(admin);

            System.out.println("✅ Admin user seeded: admin@garbage.com / admin123");
        }
    }
}