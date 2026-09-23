package com.foodrescue.features.order.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderPassResponseDto {
    private String id;
    private String restaurantName;
    private String restaurantAddress;
    private String itemTitle;
    private Integer quantity;
    private Double totalAmount;
    private String fulfillmentType;
    private String paymentMethod;
    private String pinCode;
    private String timestamp;
}
