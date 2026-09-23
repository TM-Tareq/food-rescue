package com.foodrescue.features.listing.dto;

import com.foodrescue.features.listing.model.FoodCategory;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SurplusListingCreateRequestDTO {

    @NotNull(message = "Restaurant ID is required")
    private Long restaurantId;

    @NotBlank(message = "Food item title cannot be blank")
    @Size(min = 3, max = 100, message = "Food item title must be between 3 and 100 characters")
    private String foodItemTitle;

    @NotNull(message = "Category is required")
    private FoodCategory category;

    @NotNull(message = "Portions are required")
    @Min(value = 1, message = "Portions must be at least 1")
    private Integer quantityPortions;

    @NotNull(message = "Initial price is required")
    @Min(value = 0, message = "Price cannot be negative")
    private Double initialPriceBDT;

    @NotNull(message = "Preparation time is required")
    private LocalDateTime prepTimestamp;

    @NotNull(message = "Kitchen closing time is required")
    private LocalDateTime kitchenClosingTimestamp;

    private String packagingPhotoUrl;

    @Builder.Default
    private Boolean skipAiAudit = false;
}
