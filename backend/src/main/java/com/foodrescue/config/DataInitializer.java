package com.foodrescue.config;

import com.foodrescue.features.user.model.Role;
import com.foodrescue.features.user.model.User;
import com.foodrescue.features.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.jdbc.core.JdbcTemplate;
import java.util.List;

@Configuration
@Slf4j
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final JdbcTemplate jdbcTemplate;

    @Bean
    public CommandLineRunner initDatabase() {
        return args -> {
            try {
                log.info("🌱 Synchronizing FoodRescue Database Accounts...");

                try {
                    jdbcTemplate.execute("ALTER TABLE users MODIFY COLUMN role VARCHAR(50)");
                    jdbcTemplate.execute("ALTER TABLE users MODIFY COLUMN status VARCHAR(50)");
                    jdbcTemplate.execute("ALTER TABLE users MODIFY COLUMN password VARCHAR(255)");
                    jdbcTemplate.execute("ALTER TABLE users MODIFY COLUMN password_hash VARCHAR(255)");
                } catch (Exception e) {
                    log.info("Table column resize notice: {}", e.getMessage());
                }

                List<User> seedUsers = List.of(
                    User.builder()
                        .name("Tareq Rahman (Super Admin)")
                        .email("tareq@foodrescue.org")
                        .password("Admin@2026#")
                        .passwordHash("Admin@2026#")
                        .role(Role.ADMIN)
                        .status("ACTIVE")
                        .avatar("👨‍💻")
                        .phone("+880 1711-000111")
                        .address("Dhaka Control Tower")
                        .lastActive("Online")
                        .build(),
                    User.builder()
                        .name("Star Chef Bistro")
                        .email("chef@starbistro.com")
                        .password("Chef@123456")
                        .passwordHash("Chef@123456")
                        .role(Role.RESTAURANT)
                        .status("ACTIVE")
                        .avatar("👨‍🍳")
                        .phone("+880 1712-345678")
                        .address("Gulshan 2, Dhaka")
                        .lastActive("10 mins ago")
                        .build(),
                    User.builder()
                        .name("Anjuman Orphanage Shelter")
                        .email("anjuman@shelter.org")
                        .password("Ngo@123456")
                        .passwordHash("Ngo@123456")
                        .role(Role.NGO)
                        .status("ACTIVE")
                        .avatar("🏠")
                        .phone("+880 1819-876543")
                        .address("Dhanmondi, Dhaka")
                        .lastActive("15 mins ago")
                        .build(),
                    User.builder()
                        .name("Tanvir Ahmed (Hero Rider)")
                        .email("tanvir@hero.org")
                        .password("Rider@123456")
                        .passwordHash("Rider@123456")
                        .role(Role.VOLUNTEER)
                        .status("ACTIVE")
                        .avatar("🛵")
                        .phone("+880 1911-223344")
                        .address("Banani, Dhaka")
                        .lastActive("5 mins ago")
                        .build(),
                    User.builder()
                        .name("Farhan Ahmed")
                        .email("farhan@gmail.com")
                        .password("User@123456")
                        .passwordHash("User@123456")
                        .role(Role.CONSUMER)
                        .status("ACTIVE")
                        .avatar("👨‍💼")
                        .phone("+880 1515-998877")
                        .address("Uttara, Dhaka")
                        .lastActive("1 hour ago")
                        .build()
                );

                for (User u : seedUsers) {
                    try {
                        userRepository.findByEmail(u.getEmail()).ifPresentOrElse(
                            existing -> {
                                existing.setPassword(u.getPassword());
                                existing.setPasswordHash(u.getPasswordHash());
                                existing.setRole(u.getRole());
                                existing.setStatus("ACTIVE");
                                userRepository.save(existing);
                            },
                            () -> userRepository.save(u)
                        );
                    } catch (Exception ex) {
                        log.warn("Notice: Failed to initialize account {}: {}", u.getEmail(), ex.getMessage());
                    }
                }
                log.info("✅ Single Super Admin & System Accounts Initialized Successfully!");
            } catch (Exception e) {
                log.warn("Database initialization notice: {}", e.getMessage());
            }
        };
    }
}
