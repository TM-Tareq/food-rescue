package com.foodrescue.features.listing.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NgoClaimRequestDTO {

    @NotNull(message = "Listing ID is required")
    private Long listingId;

    @NotNull(message = "NGO ID is required")
    private Long ngoId;

    @NotBlank(message = "Transport choice is required")
    private String transportChoice; // VOLUNTEER_RIDER, NGO_SELF_VAN

    @Min(value = 1, message = "Requested portions must be at least 1")
    private Integer requestedPortions;
}
