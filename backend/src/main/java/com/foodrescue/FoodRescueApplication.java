package com.foodrescue;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FoodRescueApplication {

    public static void main(String[] args) {
        SpringApplication.run(FoodRescueApplication.class, args);
        System.out.println("\n=======================================================");
        System.out.println("🚀 FoodRescue Spring Boot Backend Started Successfully!");
        System.out.println("   API Endpoint: http://localhost:8080/api/v1");
        System.out.println("=======================================================\n");
    }
}
