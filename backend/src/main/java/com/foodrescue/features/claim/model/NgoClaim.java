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

    private String ngoId;
    private Long foodId;
    private String transportChoice;
    private String pickupOtp;

    @Enumerated(EnumType.STRING)
    private ClaimStatus status;

    private LocalDateTime claimedAt;
}
