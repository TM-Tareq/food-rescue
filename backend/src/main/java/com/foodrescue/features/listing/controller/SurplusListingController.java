package com.foodrescue.features.listing.controller;

import com.foodrescue.features.listing.dto.CreateSurplusRequestDto;
import com.foodrescue.features.listing.dto.MarketplaceDealResponseDto;
import com.foodrescue.features.listing.dto.SurplusResponseDto;
import com.foodrescue.features.listing.service.SurplusListingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/surplus")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SurplusListingController {

    private final SurplusListingService surplusListingService;

    @PostMapping
    public ResponseEntity<SurplusResponseDto> createSurplusListing(@RequestBody CreateSurplusRequestDto request) {
        SurplusResponseDto created = surplusListingService.createSurplusListing(request);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/active")
    public ResponseEntity<List<SurplusResponseDto>> getActiveListings() {
        return ResponseEntity.ok(surplusListingService.getActiveListings());
    }

    @GetMapping("/marketplace/deals")
    public ResponseEntity<List<MarketplaceDealResponseDto>> getMarketplaceDeals() {
        return ResponseEntity.ok(surplusListingService.getMarketplaceDeals());
    }
}
