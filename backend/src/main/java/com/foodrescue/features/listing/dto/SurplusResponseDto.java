package com.foodrescue.features.listing.dto;

import com.foodrescue.features.listing.model.AiGrade;
import com.foodrescue.features.listing.model.ListingStatus;
import com.foodrescue.features.listing.model.ListingTier;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SurplusResponseDto {
    private Long id;
    private Long restaurantId;
    private String foodItemTitle;
    private Integer quantityPortions;
    private Double currentPriceBDT;
    private ListingTier currentTier;
    private AiGrade aiQualityGrade;
    private Integer aiHygieneScore;
    private ListingStatus status;
    private String packagingPhotoUrl;
    private LocalDateTime finalExpiryTimestamp;
    private LocalDateTime createdAt;
}
