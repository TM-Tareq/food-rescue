package com.foodrescue.features.listing.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MarketplaceDealResponseDto {
    private String id;
    private String restaurantName;
    private Double rating;
    private String itemTitle;
    private Double originalPrice;
    private Double discountedPrice;
    private Integer discountPercent;
    private Integer portionCount;
    private Long expiryTimeMinutes;
    private Double distanceKm;
    private String area;
}
