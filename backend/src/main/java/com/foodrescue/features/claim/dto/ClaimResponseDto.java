package com.foodrescue.features.claim.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClaimResponseDto {
    private String claimId;
    private String id;
    private String title;
    private String donor;
    private String claimedAt;
    private String status;
    private String pickupOtp;
    private String eta;
    private String message;
}
