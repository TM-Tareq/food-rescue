package com.foodrescue.features.listing.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiTimeWindowCalculationResultDTO {

    private Integer totalSafeMinutes; // Total calculated safe shelf-life
    private LocalDateTime tier1NgoEnd;      // 60% of total safe time
    private LocalDateTime tier2ConsumerEnd; // 30% of total safe time
    private LocalDateTime tier3FlashEnd;    // 10% of total safe time

    private Double perishabilityIndex; // 0.1 (Dry) to 1.0 (Seafood/Hot Cooked)
    private Double ambientTempCelsius; // Dhaka weather (e.g. 34.0°C)
    private String calculationExplanation;
}
