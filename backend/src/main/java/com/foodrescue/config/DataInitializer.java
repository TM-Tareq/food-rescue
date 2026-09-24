package com.foodrescue.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
public class DataInitializer {

    @Bean
    public CommandLineRunner initDatabase() {
        return args -> {
            log.info("🌱 Seeding FoodRescue Initial Demo Entities...");
            log.info("   [User]: Star Chef Bistro (Banani) - RESTAURANT");
            log.info("   [User]: Anjuman Orphanage Shelter - NGO");
            log.info("   [User]: Tanvir Ahmed (Hero Rider #V-9012) - VOLUNTEER");
            log.info("   [User]: Farhan Ahmed - CONSUMER");
            log.info("   [User]: Tareq Rahman - SUPER_ADMIN");
            log.info("✅ Database Seeding Completed!");
        };
    }
}
