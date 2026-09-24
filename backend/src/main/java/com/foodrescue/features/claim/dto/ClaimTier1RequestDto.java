package com.foodrescue.features.claim.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClaimTier1RequestDto {

    @NotNull(message = "Surplus food ID is required")
    private Long foodId;

    @NotBlank(message = "Transport choice is required (VOLUNTEER or SELF_PICKUP)")
    private String transportChoice;

    private String claimedAt;
}
