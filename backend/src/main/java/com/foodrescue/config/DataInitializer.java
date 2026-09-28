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

import com.foodrescue.features.listing.model.*;
import com.foodrescue.features.listing.repository.SurplusListingRepository;
import java.time.LocalDateTime;

@Configuration
@Slf4j
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final SurplusListingRepository surplusListingRepository;
    private final JdbcTemplate jdbcTemplate;

    @Bean
    public CommandLineRunner initDatabase() {
        return args -> {
            try {
                log.info("🌱 Synchronizing FoodRescue Database Accounts & Modules...");

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
                        .name("Kacchi Bhai Restaurant")
                        .email("kacchi@bhai.com")
                        .password("Kacchi@123456")
                        .passwordHash("Kacchi@123456")
                        .role(Role.RESTAURANT)
                        .status("ACTIVE")
                        .avatar("🍖")
                        .phone("+880 1622-445566")
                        .address("Bailey Road, Dhaka")
                        .lastActive("30 mins ago")
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
                        .name("Bicharok Relief Foundation")
                        .email("bicharok@relief.org")
                        .password("Relief@123456")
                        .passwordHash("Relief@123456")
                        .role(Role.NGO)
                        .status("ACTIVE")
                        .avatar("🤝")
                        .phone("+880 1733-112233")
                        .address("Mirpur 10, Dhaka")
                        .lastActive("1 hour ago")
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

                // Seed Initial Surplus Food Listings if database empty
                if (surplusListingRepository.count() == 0) {
                    LocalDateTime now = LocalDateTime.now();
                    List<SurplusListing> seedListings = List.of(
                        SurplusListing.builder()
                            .restaurantId(1L)
                            .restaurantName("Star Chef Bistro")
                            .restaurantArea("Gulshan 2, Dhaka")
                            .foodItemTitle("Mutton Kacchi Biryani & Borhani (20 Packs)")
                            .category(FoodCategory.COOKED)
                            .quantityPortions(20)
                            .initialPriceBDT(450.0)
                            .currentPriceBDT(0.0)
                            .prepTimestamp(now.minusHours(1))
                            .kitchenClosingTimestamp(now.plusHours(2))
                            .finalExpiryTimestamp(now.plusHours(4))
                            .tier1NgoWindowEnd(now.plusMinutes(45))
                            .tier2ConsumerWindowEnd(now.plusHours(2))
                            .tier3FlashWindowEnd(now.plusHours(4))
                            .ngoStartAt(now)
                            .ngoEndAt(now.plusMinutes(45))
                            .consumerStartAt(now.plusMinutes(45))
                            .consumerEndAt(now.plusHours(4))
                            .expiresAt(now.plusHours(4))
                            .currentTier(ListingTier.TIER1_NGO_FREE)
                            .aiHygieneScore(98)
                            .aiQualityGrade(AiGrade.GRADE_A_PLUS)
                            .packagingPhotoUrl("/images/mutton-kacchi.svg")
                            .isAiAuditSkipped(false)
                            .status(ListingStatus.ACTIVE)
                            .build(),
                        SurplusListing.builder()
                            .restaurantId(2L)
                            .restaurantName("Kacchi Bhai Restaurant")
                            .restaurantArea("Bailey Road, Dhaka")
                            .foodItemTitle("Chicken Polao & Roast Combo (15 Packs)")
                            .category(FoodCategory.COOKED)
                            .quantityPortions(15)
                            .initialPriceBDT(350.0)
                            .currentPriceBDT(140.0)
                            .prepTimestamp(now.minusHours(2))
                            .kitchenClosingTimestamp(now.plusHours(1))
                            .finalExpiryTimestamp(now.plusHours(3))
                            .tier1NgoWindowEnd(now.minusMinutes(10))
                            .tier2ConsumerWindowEnd(now.plusHours(1))
                            .tier3FlashWindowEnd(now.plusHours(3))
                            .ngoStartAt(now.minusHours(1))
                            .ngoEndAt(now.minusMinutes(10))
                            .consumerStartAt(now.minusMinutes(10))
                            .consumerEndAt(now.plusHours(3))
                            .expiresAt(now.plusHours(3))
                            .currentTier(ListingTier.TIER2_CONSUMER_DISCOUNT)
                            .aiHygieneScore(95)
                            .aiQualityGrade(AiGrade.GRADE_A_PLUS)
                            .packagingPhotoUrl("/images/chicken-polao.svg")
                            .isAiAuditSkipped(false)
                            .status(ListingStatus.ACTIVE)
                            .build()
                    );
                    surplusListingRepository.saveAll(seedListings);
                    log.info("🌱 Seeded Initial Surplus Food Listings into MySQL Database.");
                }

                log.info("✅ FoodRescue System Database Accounts & Modules Initialized Successfully!");
            } catch (Exception e) {
                log.warn("Database initialization notice: {}", e.getMessage());
            }
        };
    }
}
