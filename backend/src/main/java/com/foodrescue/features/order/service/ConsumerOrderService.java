package com.foodrescue.features.order.service;

import com.foodrescue.features.order.dto.OrderCheckoutRequestDto;
import com.foodrescue.features.order.dto.OrderPassResponseDto;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@Service
public class ConsumerOrderService {

    public OrderPassResponseDto checkoutEscrowOrder(OrderCheckoutRequestDto request) {
        String passId = "PASS-" + ((int)(Math.random() * 900000) + 100000);
        String pinCode = String.valueOf((int)(Math.random() * 9000) + 1000);

        return OrderPassResponseDto.builder()
                .id(passId)
                .restaurantName(request.getRestaurantName() != null ? request.getRestaurantName() : "Kacchi Bhai Banani")
                .restaurantAddress("Block D, Banani Rd 11, Dhaka")
                .itemTitle("Surplus Discounted Meal Pack")
                .quantity(1)
                .totalAmount(request.getTotalAmount() != null ? request.getTotalAmount() : 220.0)
                .fulfillmentType(request.getFulfillmentType() != null ? request.getFulfillmentType() : "pickup")
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod().toUpperCase() : "BKASH")
                .pinCode(pinCode)
                .timestamp(LocalTime.now().format(DateTimeFormatter.ofPattern("hh:mm a")))
                .build();
    }
}
