package com.foodrescue.features.listing.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "surplus_listings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SurplusListing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "restaurant_id", nullable = false)
    private Long restaurantId;

    @Column(name = "food_item_title", nullable = false)
    private String foodItemTitle;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    private FoodCategory category; // COOKED, BAKERY, DAIRY, DRY_GROCERY

    @Column(name = "quantity_portions", nullable = false)
    private Integer quantityPortions;

    @Column(name = "initial_price_bdt", nullable = false)
    private Double initialPriceBDT;

    @Column(name = "current_price_bdt")
    private Double currentPriceBDT;

    // Time Parameters
    @Column(name = "prep_timestamp", nullable = false)
    private LocalDateTime prepTimestamp;

    @Column(name = "kitchen_closing_timestamp", nullable = false)
    private LocalDateTime kitchenClosingTimestamp;

    @Column(name = "final_expiry_timestamp", nullable = false)
    private LocalDateTime finalExpiryTimestamp;

    // Dynamic Tier Time Windows (Calculated by AI Engine)
    @Column(name = "tier1_ngo_window_end")
    private LocalDateTime tier1NgoWindowEnd;

    @Column(name = "tier2_consumer_window_end")
    private LocalDateTime tier2ConsumerWindowEnd;

    @Column(name = "tier3_flash_window_end")
    private LocalDateTime tier3FlashWindowEnd;

    @Enumerated(EnumType.STRING)
    @Column(name = "current_tier", nullable = false)
    private ListingTier currentTier; // TIER1_NGO_FREE, TIER2_CONSUMER_DISCOUNT, TIER3_EMERGENCY_FLASH

    // AI Hygiene Audit Result
    @Column(name = "ai_hygiene_score")
    private Integer aiHygieneScore; // 0 - 100

    @Enumerated(EnumType.STRING)
    @Column(name = "ai_quality_grade")
    private AiGrade aiQualityGrade; // GRADE_A_PLUS, GRADE_F_REJECTED, MANUAL_UNVERIFIED

    @Column(name = "packaging_photo_url")
    private String packagingPhotoUrl;

    @Column(name = "is_ai_audit_skipped")
    private Boolean isAiAuditSkipped;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ListingStatus status; // ACTIVE, CLAIMED_BY_NGO, BOUGHT_BY_CONSUMER, EXPIRED, CANCELLED

    @Version
    @Column(name = "version")
    private Long version; // Optimistic locking for concurrency control

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
