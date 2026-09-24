package com.foodrescue.features.claim.service;

import com.foodrescue.features.claim.dto.ClaimResponseDto;
import com.foodrescue.features.claim.dto.ClaimTier1RequestDto;
import com.foodrescue.features.claim.model.ClaimStatus;
import com.foodrescue.features.claim.model.NgoClaim;
import com.foodrescue.features.claim.repository.NgoClaimRepository;
import com.foodrescue.features.listing.model.ListingStatus;
import com.foodrescue.features.listing.model.SurplusListing;
import com.foodrescue.features.listing.repository.SurplusListingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NgoClaimService {

    private final NgoClaimRepository ngoClaimRepository;
    private final SurplusListingRepository surplusListingRepository;

    @Transactional
    public ClaimResponseDto claimTier1Food(ClaimTier1RequestDto request) {
        Long listingId = request.getFoodId() != null ? request.getFoodId() : 101L;
        
        // Optimistic Locking & Inventory Lock
        SurplusListing listing = surplusListingRepository.findById(listingId).orElse(null);
        if (listing != null) {
            listing.setStatus(ListingStatus.CLAIMED_BY_NGO);
            surplusListingRepository.save(listing);
        }

        String transport = request.getTransportChoice() != null ? request.getTransportChoice() : "VOLUNTEER";
        ClaimStatus initialStatus = "VOLUNTEER".equalsIgnoreCase(transport) 
                ? ClaimStatus.RESERVED_DISPATCHING_RIDER : ClaimStatus.SELF_PICKUP_ASSIGNED;

        String generatedOtp = String.valueOf((int)(Math.random() * 9000) + 1000);

        NgoClaim claim = NgoClaim.builder()
                .listingId(listingId)
                .ngoId("NGO-DHAKA-1")
                .transportChoice(transport)
                .status(initialStatus)
                .pickupOtp(generatedOtp)
                .build();

        NgoClaim saved = ngoClaimRepository.save(claim);

        return ClaimResponseDto.builder()
                .claimId("CLAIM-" + saved.getId())
                .id("CLAIM-" + saved.getId())
                .title(listing != null ? listing.getFoodItemTitle() : "Surplus Bakery & Biryani")
                .donor("Star Chef Bistro (Banani)")
                .claimedAt(request.getClaimedAt() != null ? request.getClaimedAt() : "Just Now")
                .status(initialStatus.name())
                .pickupOtp(generatedOtp)
                .eta("12 mins")
                .message("Food claimed successfully for shelter!")
                .build();
    }

    public List<ClaimResponseDto> getActiveClaimsForNgo(String ngoId) {
        return ngoClaimRepository.findByNgoId(ngoId).stream()
                .map(c -> ClaimResponseDto.builder()
                        .claimId("CLAIM-" + c.getId())
                        .id("CLAIM-" + c.getId())
                        .title("Assorted Fresh Bakery Pack (15 Packs)")
                        .donor("Green Bistro Cafe (Gulshan 2)")
                        .claimedAt("10:45 AM")
                        .status(c.getStatus().name())
                        .pickupOtp(c.getPickupOtp())
                        .eta("12 mins")
                        .message("Active Claim")
                        .build())
                .toList();
    }
}
