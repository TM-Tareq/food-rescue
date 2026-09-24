package com.foodrescue.features.listing.dto;

import com.foodrescue.features.listing.model.FoodCategory;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateSurplusRequestDto {

    @NotNull(message = "Restaurant ID is required")
    private Long restaurantId;

    @NotBlank(message = "Food item title cannot be blank")
    @Size(min = 3, max = 120, message = "Title must be between 3 and 120 characters")
    private String foodItemTitle;

    @NotNull(message = "Food category is required")
    private FoodCategory category;

    @NotNull(message = "Quantity portions required")
    @Min(value = 1, message = "Minimum 1 portion required")
    @Max(value = 500, message = "Maximum 500 portions allowed per post")
    private Integer quantityPortions;

    @NotNull(message = "Initial price in BDT is required")
    @PositiveOrZero(message = "Price must be positive or zero")
    private Double initialPriceBDT;

    private LocalDateTime prepTimestamp;
    private LocalDateTime kitchenClosingTimestamp;
    private LocalDateTime finalExpiryTimestamp;
    private String packagingPhotoUrl;
    private Boolean skipAiAudit;
}
