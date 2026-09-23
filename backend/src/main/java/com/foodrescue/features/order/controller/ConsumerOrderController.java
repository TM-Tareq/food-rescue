package com.foodrescue.features.order.controller;

import com.foodrescue.features.order.dto.OrderCheckoutRequestDto;
import com.foodrescue.features.order.dto.OrderPassResponseDto;
import com.foodrescue.features.order.service.ConsumerOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ConsumerOrderController {

    private final ConsumerOrderService consumerOrderService;

    @PostMapping("/checkout")
    public ResponseEntity<OrderPassResponseDto> checkoutEscrowOrder(@RequestBody OrderCheckoutRequestDto request) {
        return ResponseEntity.ok(consumerOrderService.checkoutEscrowOrder(request));
    }
}
