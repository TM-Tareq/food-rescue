package com.foodrescue.features.listing.dto;

import com.foodrescue.features.listing.model.AiGrade;
import com.foodrescue.features.listing.model.ListingStatus;
import com.foodrescue.features.listing.model.ListingTier;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SurplusListingResponseDTO {

    private Long id;
    private Long restaurantId;
    private String restaurantName;
    private String restaurantArea;
    private String foodItemTitle;
    private Integer quantityPortions;

    // Pricing & Discounts
    private Double originalPriceBDT;
    private Double currentPriceBDT;
    private Integer dynamicDiscountPercent; // e.g. 0%, 70%, 80%

    // Dynamic Tier Status
    private ListingTier currentTier;
    private Long remainingNgoWindowMins;
    private Long remainingConsumerWindowMins;
    private Long remainingFinalExpiryMins;

    // AI Safety Seal
    private Integer aiHygieneScore;
    private AiGrade aiQualityGrade;
    private String packagingPhotoUrl;

    private ListingStatus status;
}
