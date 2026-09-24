package com.foodrescue.features.claim;

import com.foodrescue.features.claim.dto.ClaimResponseDto;
import com.foodrescue.features.claim.dto.ClaimTier1RequestDto;
import com.foodrescue.features.claim.model.NgoClaim;
import com.foodrescue.features.claim.repository.NgoClaimRepository;
import com.foodrescue.features.claim.service.NgoClaimService;
import com.foodrescue.features.listing.repository.SurplusListingRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NgoClaimServiceTest {

    @Mock
    private NgoClaimRepository ngoClaimRepository;

    @Mock
    private SurplusListingRepository surplusListingRepository;

    @InjectMocks
    private NgoClaimService ngoClaimService;

    @Test
    void testClaimTier1FoodSuccess() {
        ClaimTier1RequestDto request = ClaimTier1RequestDto.builder()
                .foodId(101L)
                .transportChoice("VOLUNTEER")
                .build();

        NgoClaim savedClaim = NgoClaim.builder()
                .id(901L)
                .transportChoice("VOLUNTEER")
                .pickupOtp("4892")
                .build();

        when(ngoClaimRepository.save(any(NgoClaim.class))).thenReturn(savedClaim);

        ClaimResponseDto response = ngoClaimService.claimTier1Food(request);
        assertNotNull(response);
        assertTrue(response.getClaimId().contains("CLAIM-"));
    }
}
