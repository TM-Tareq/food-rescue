package com.foodrescue.features.listing.scheduler;

import com.foodrescue.features.listing.model.ListingStatus;
import com.foodrescue.features.listing.model.ListingTier;
import com.foodrescue.features.listing.model.SurplusListing;
import com.foodrescue.features.listing.repository.SurplusListingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SurplusTierSchedulerService {

    private final SurplusListingRepository surplusListingRepository;

    @Scheduled(fixedRate = 60000) // Runs every 60 seconds
    @Transactional
    public void evaluateTierTransitions() {
        LocalDateTime now = LocalDateTime.now();
        List<SurplusListing> activeListings = surplusListingRepository.findByStatus(ListingStatus.ACTIVE);

        for (SurplusListing item : activeListings) {
            if (now.isAfter(item.getFinalExpiryTimestamp())) {
                item.setStatus(ListingStatus.EXPIRED);
            } else if (item.getCurrentTier() == ListingTier.TIER1_NGO_FREE && now.isAfter(item.getTier1NgoWindowEnd())) {
                item.setCurrentTier(ListingTier.TIER2_CONSUMER_DISCOUNT);
                item.setCurrentPriceBDT(item.getInitialPriceBDT() * 0.4); // 60% discount
            } else if (item.getCurrentTier() == ListingTier.TIER2_CONSUMER_DISCOUNT && now.isAfter(item.getTier2ConsumerWindowEnd())) {
                item.setCurrentTier(ListingTier.TIER3_EMERGENCY_FLASH);
                item.setCurrentPriceBDT(item.getInitialPriceBDT() * 0.15); // 85% emergency discount
            }
            surplusListingRepository.save(item);
        }
    }
}
