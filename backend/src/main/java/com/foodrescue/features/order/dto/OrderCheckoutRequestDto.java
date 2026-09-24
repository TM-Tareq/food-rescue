package com.foodrescue.features.order.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderCheckoutRequestDto {

    @NotBlank(message = "Restaurant name is required")
    private String restaurantName;

    @NotNull(message = "Total amount is required")
    @Positive(message = "Total amount must be greater than zero")
    private Double totalAmount;

    @NotBlank(message = "Fulfillment type is required (pickup or delivery)")
    private String fulfillmentType;

    @NotBlank(message = "Payment method is required (BKASH, NAGAD, CARD)")
    private String paymentMethod;
}
