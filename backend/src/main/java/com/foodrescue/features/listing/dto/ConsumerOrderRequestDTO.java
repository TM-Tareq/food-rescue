package com.foodrescue.features.listing.dto;

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
public class ConsumerOrderRequestDTO {

    @NotNull(message = "Listing ID is required")
    private Long listingId;

    @NotNull(message = "Consumer User ID is required")
    private Long consumerUserId;

    @NotBlank(message = "Fulfillment type is required")
    private String fulfillmentType; // SELF_TAKEAWAY, VOLUNTEER_DELIVERY

    @NotBlank(message = "Payment method is required")
    private String paymentMethod; // BKASH, NAGAD, CARD

    private String deliveryAddress;
}
