package com.foodrescue.features.claim.controller;

import com.foodrescue.features.claim.dto.ClaimResponseDto;
import com.foodrescue.features.claim.dto.ClaimTier1RequestDto;
import com.foodrescue.features.claim.service.NgoClaimService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/claims")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NgoClaimController {

    private final NgoClaimService ngoClaimService;

    @PostMapping("/claim-tier1")
    public ResponseEntity<ClaimResponseDto> claimTier1Food(@RequestBody ClaimTier1RequestDto request) {
        return ResponseEntity.ok(ngoClaimService.claimTier1Food(request));
    }

    @GetMapping("/ngo/{ngoId}")
    public ResponseEntity<List<ClaimResponseDto>> getActiveClaims(@PathVariable String ngoId) {
        return ResponseEntity.ok(ngoClaimService.getActiveClaimsForNgo(ngoId));
    }
}
