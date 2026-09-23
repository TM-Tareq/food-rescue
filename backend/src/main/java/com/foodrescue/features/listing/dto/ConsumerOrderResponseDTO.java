package com.foodrescue.features.listing.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConsumerOrderResponseDTO {

    private String orderPassId; // e.g. "PASS-98402"
    private String restaurantName;
    private String restaurantAddress;
    private String itemTitle;
    private Integer quantity;
    private Double totalAmountPaidBDT;
    private String paymentMethod;
    private String fulfillmentType;

    // Digital QR Pass Payload
    private String scannableQrCodePayload;
    private String redemptionPinCode; // e.g. "7892"
    private LocalDateTime reservationHoldExpiry; // 10-Minute Hold Timer
    private LocalDateTime passValidUntil;
}
