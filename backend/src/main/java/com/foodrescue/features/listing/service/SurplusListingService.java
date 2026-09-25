package com.foodrescue.features.listing.service;

import com.foodrescue.features.listing.dto.CreateSurplusRequestDto;
import com.foodrescue.features.listing.dto.MarketplaceDealResponseDto;
import com.foodrescue.features.listing.dto.SurplusResponseDto;
import com.foodrescue.features.listing.model.*;
import com.foodrescue.features.listing.repository.SurplusListingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SurplusListingService {

    private final SurplusListingRepository surplusListingRepository;
    private final AiVisionAuditService aiVisionAuditService;

    @Transactional
    public SurplusResponseDto createSurplusListing(CreateSurplusRequestDto request) {
        LocalDateTime now = LocalDateTime.now();
        
        // Execute AI Vision Safety Audit
        AiVisionAuditService.AuditResult auditResult;
        if (Boolean.TRUE.equals(request.getSkipAiAudit())) {
            auditResult = AiVisionAuditService.AuditResult.builder()
                    .grade(AiGrade.MANUAL_UNVERIFIED)
                    .hygieneScore(70)
                    .recommendedTier1Minutes(15)
                    .aiSummaryNotes("AI Audit Skipped. Manual On-Site Verification Required.")
                    .isFresh(true)
                    .build();
        } else {
            String catStr = request.getCategory() != null ? request.getCategory().name() : "COOKED";
            auditResult = aiVisionAuditService.inspectFoodPhoto(request.getPackagingPhotoUrl(), catStr);
        }

        LocalDateTime kitchenClosing = request.getKitchenClosingTimestamp() != null 
                ? request.getKitchenClosingTimestamp() : now.plusHours(2);
        LocalDateTime finalExpiry = request.getFinalExpiryTimestamp() != null 
                ? request.getFinalExpiryTimestamp() : now.plusHours(4);

        // Dynamic Tier 1 Time Window calculated by AI Audit Result
        int tier1Minutes = auditResult.getRecommendedTier1Minutes();
        LocalDateTime tier1End = now.plusMinutes(tier1Minutes);
        if (tier1End.isAfter(kitchenClosing)) {
            tier1End = kitchenClosing;
        }

        LocalDateTime tier2End = tier1End.plusHours(1);
        LocalDateTime tier3End = finalExpiry;

        SurplusListing listing = SurplusListing.builder()
                .restaurantId(request.getRestaurantId() != null ? request.getRestaurantId() : 1L)
                .foodItemTitle(request.getFoodItemTitle() != null ? request.getFoodItemTitle() : "Surplus Meal")
                .category(request.getCategory() != null ? request.getCategory() : FoodCategory.COOKED)
                .quantityPortions(request.getQuantityPortions() != null ? request.getQuantityPortions() : 20)
                .initialPriceBDT(request.getInitialPriceBDT() != null ? request.getInitialPriceBDT() : 250.0)
                .currentPriceBDT(0.0) // Tier 1 Free for NGO
                .prepTimestamp(request.getPrepTimestamp() != null ? request.getPrepTimestamp() : now.minusHours(1))
                .kitchenClosingTimestamp(kitchenClosing)
                .finalExpiryTimestamp(finalExpiry)
                .tier1NgoWindowEnd(tier1End)
                .tier2ConsumerWindowEnd(tier2End)
                .tier3FlashWindowEnd(tier3End)
                .currentTier(ListingTier.TIER1_NGO_FREE)
                .aiHygieneScore(auditResult.getHygieneScore())
                .aiQualityGrade(auditResult.getGrade())
                .packagingPhotoUrl(request.getPackagingPhotoUrl())
                .isAiAuditSkipped(request.getSkipAiAudit())
                .status(ListingStatus.ACTIVE)
                .build();

        SurplusListing saved = surplusListingRepository.save(listing);
        return mapToResponseDto(saved);
    }

    public List<SurplusResponseDto> getActiveListings() {
        return surplusListingRepository.findByStatus(ListingStatus.ACTIVE)
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public List<MarketplaceDealResponseDto> getMarketplaceDeals() {
        return surplusListingRepository.findByStatus(ListingStatus.ACTIVE)
                .stream()
                .map(item -> {
                    long minutesLeft = Duration.between(LocalDateTime.now(), item.getFinalExpiryTimestamp()).toMinutes();
                    double origPrice = item.getInitialPriceBDT() != null ? item.getInitialPriceBDT() : 450.0;
                    double discPrice = origPrice * 0.4; // 60% discount
                    return MarketplaceDealResponseDto.builder()
                            .id("DEAL-" + item.getId())
                            .restaurantName("Star Chef Bistro - Banani")
                            .rating(4.8)
                            .itemTitle(item.getFoodItemTitle())
                            .originalPrice(origPrice)
                            .discountedPrice(discPrice)
                            .discountPercent(60)
                            .portionCount(item.getQuantityPortions())
                            .expiryTimeMinutes(Math.max(minutesLeft, 15L))
                            .distanceKm(1.2)
                            .area("Banani Road 11")
                            .build();
                })
                .collect(Collectors.toList());
    }

    private SurplusResponseDto mapToResponseDto(SurplusListing listing) {
        return SurplusResponseDto.builder()
                .id(listing.getId())
                .restaurantId(listing.getRestaurantId())
                .foodItemTitle(listing.getFoodItemTitle())
                .quantityPortions(listing.getQuantityPortions())
                .currentPriceBDT(listing.getCurrentPriceBDT())
                .currentTier(listing.getCurrentTier())
                .aiQualityGrade(listing.getAiQualityGrade())
                .aiHygieneScore(listing.getAiHygieneScore())
                .status(listing.getStatus())
                .packagingPhotoUrl(listing.getPackagingPhotoUrl())
                .finalExpiryTimestamp(listing.getFinalExpiryTimestamp())
                .createdAt(listing.getCreatedAt())
                .build();
    }
}
