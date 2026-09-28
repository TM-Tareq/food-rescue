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
                .restaurantName(request.getRestaurantName() != null ? request.getRestaurantName() : "Star Chef Bistro")
                .restaurantArea(request.getRestaurantArea() != null ? request.getRestaurantArea() : "Banani, Dhaka")
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
                .createdAt(now)
                .ngoStartAt(now)
                .ngoEndAt(tier1End)
                .consumerStartAt(tier1End)
                .consumerEndAt(finalExpiry)
                .expiresAt(finalExpiry)
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
        LocalDateTime now = LocalDateTime.now();
        return surplusListingRepository.findByStatus(ListingStatus.ACTIVE)
                .stream()
                .filter(item -> {
                    LocalDateTime consumerStart = item.getConsumerStartAt() != null ? item.getConsumerStartAt() : item.getNgoEndAt();
                    LocalDateTime expiresAt = item.getExpiresAt() != null ? item.getExpiresAt() : item.getFinalExpiryTimestamp();
                    boolean hasConsumerStarted = consumerStart == null || !now.isBefore(consumerStart);
                    boolean isNotExpired = expiresAt == null || now.isBefore(expiresAt);
                    return hasConsumerStarted && isNotExpired;
                })
                .map(item -> {
                    LocalDateTime finalExpiry = item.getFinalExpiryTimestamp() != null ? item.getFinalExpiryTimestamp() : LocalDateTime.now().plusHours(2);
                    long minutesLeft = Math.max(0L, Duration.between(LocalDateTime.now(), finalExpiry).toMinutes());
                    double origPrice = item.getInitialPriceBDT() != null ? item.getInitialPriceBDT() : 450.0;
                    double discPrice = origPrice * 0.4; // 60% discount
                    String restoName = item.getRestaurantName() != null ? item.getRestaurantName() : "Star Chef Bistro";
                    String areaName = item.getRestaurantArea() != null ? item.getRestaurantArea() : "Banani Road 11";
                    return MarketplaceDealResponseDto.builder()
                            .id("DEAL-" + item.getId())
                            .restaurantName(restoName)
                            .rating(4.8)
                            .itemTitle(item.getFoodItemTitle())
                            .originalPrice(origPrice)
                            .discountedPrice(discPrice)
                            .discountPercent(60)
                            .portionCount(item.getQuantityPortions())
                            .expiryTimeMinutes(Math.max(minutesLeft, 15L))
                            .distanceKm(1.2)
                            .area(areaName)
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public SurplusResponseDto updateSurplusListing(Long id, CreateSurplusRequestDto request) {
        SurplusListing listing = surplusListingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Surplus listing not found with id: " + id));

        if (request.getFoodItemTitle() != null && !request.getFoodItemTitle().isBlank()) {
            listing.setFoodItemTitle(request.getFoodItemTitle());
        }
        if (request.getRestaurantName() != null && !request.getRestaurantName().isBlank()) {
            listing.setRestaurantName(request.getRestaurantName());
        }
        if (request.getRestaurantArea() != null && !request.getRestaurantArea().isBlank()) {
            listing.setRestaurantArea(request.getRestaurantArea());
        }
        if (request.getCategory() != null) {
            listing.setCategory(request.getCategory());
        }
        if (request.getQuantityPortions() != null) {
            listing.setQuantityPortions(request.getQuantityPortions());
        }
        if (request.getInitialPriceBDT() != null) {
            listing.setInitialPriceBDT(request.getInitialPriceBDT());
        }
        if (request.getPackagingPhotoUrl() != null) {
            listing.setPackagingPhotoUrl(request.getPackagingPhotoUrl());
        }
        listing.setUpdatedAt(LocalDateTime.now());

        SurplusListing updated = surplusListingRepository.save(listing);
        return mapToResponseDto(updated);
    }

    @Transactional
    public void deleteSurplusListing(Long id) {
        if (surplusListingRepository.existsById(id)) {
            surplusListingRepository.deleteById(id);
        }
    }

    private SurplusResponseDto mapToResponseDto(SurplusListing listing) {
        return SurplusResponseDto.builder()
                .id(listing.getId())
                .restaurantId(listing.getRestaurantId())
                .restaurantName(listing.getRestaurantName() != null ? listing.getRestaurantName() : "Star Chef Bistro")
                .restaurantArea(listing.getRestaurantArea() != null ? listing.getRestaurantArea() : "Banani, Dhaka")
                .foodItemTitle(listing.getFoodItemTitle())
                .quantityPortions(listing.getQuantityPortions())
                .initialPriceBDT(listing.getInitialPriceBDT())
                .currentPriceBDT(listing.getCurrentPriceBDT())
                .currentTier(listing.getCurrentTier())
                .aiQualityGrade(listing.getAiQualityGrade())
                .aiHygieneScore(listing.getAiHygieneScore())
                .status(listing.getStatus())
                .packagingPhotoUrl(listing.getPackagingPhotoUrl())
                .finalExpiryTimestamp(listing.getFinalExpiryTimestamp())
                .createdAt(listing.getCreatedAt())
                .ngoStartAt(listing.getNgoStartAt())
                .ngoEndAt(listing.getNgoEndAt())
                .consumerStartAt(listing.getConsumerStartAt())
                .consumerEndAt(listing.getConsumerEndAt())
                .expiresAt(listing.getExpiresAt())
                .build();
    }
}
