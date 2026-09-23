package com.foodrescue.features.listing.repository;

import com.foodrescue.features.listing.model.ListingStatus;
import com.foodrescue.features.listing.model.ListingTier;
import com.foodrescue.features.listing.model.SurplusListing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SurplusListingRepository extends JpaRepository<SurplusListing, Long> {

    List<SurplusListing> findByRestaurantId(Long restaurantId);

    List<SurplusListing> findByStatus(ListingStatus status);

    List<SurplusListing> findByCurrentTierAndStatus(ListingTier currentTier, ListingStatus status);
}
