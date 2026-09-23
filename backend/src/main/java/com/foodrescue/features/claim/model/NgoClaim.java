package com.foodrescue.features.claim.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ngo_claims")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NgoClaim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "listing_id", nullable = false)
    private Long listingId;

    @Column(name = "ngo_id", nullable = false)
    private String ngoId;

    @Column(name = "transport_choice", nullable = false)
    private String transportChoice; // VOLUNTEER or SELF_PICKUP

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ClaimStatus status;

    @Column(name = "pickup_otp")
    private String pickupOtp;

    @Column(name = "claimed_at")
    private LocalDateTime claimedAt;

    @PrePersist
    protected void onCreate() {
        this.claimedAt = LocalDateTime.now();
    }
}
