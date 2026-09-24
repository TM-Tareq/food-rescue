package com.foodrescue.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI foodRescueOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("FoodRescue API Specifications")
                        .description("Surplus Food Rescue & Dynamic Discount Marketplace Backend API")
                        .version("v1.0.0")
                        .contact(new Contact()
                                .name("FoodRescue Engineering Team")
                                .email("dev@foodrescue.org")));
    }
}
