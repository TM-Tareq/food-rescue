package com.foodrescue.features.claim.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ngo_claims_tier1")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NgoClaim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long listingId;

    private String ngoId;

    private String transportChoice;

    @Enumerated(EnumType.STRING)
    private ClaimStatus status;

    private String pickupOtp;

    @Builder.Default
    private LocalDateTime claimedAt = LocalDateTime.now();
}
