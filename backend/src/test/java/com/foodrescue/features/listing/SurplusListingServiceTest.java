package com.foodrescue.features.listing;

import com.foodrescue.features.listing.dto.CreateSurplusRequestDto;
import com.foodrescue.features.listing.dto.SurplusResponseDto;
import com.foodrescue.features.listing.model.FoodCategory;
import com.foodrescue.features.listing.model.SurplusListing;
import com.foodrescue.features.listing.repository.SurplusListingRepository;
import com.foodrescue.features.listing.service.SurplusListingService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SurplusListingServiceTest {

    @Mock
    private SurplusListingRepository surplusListingRepository;

    @InjectMocks
    private SurplusListingService surplusListingService;

    @Test
    void testCreateSurplusListingSuccess() {
        CreateSurplusRequestDto request = CreateSurplusRequestDto.builder()
                .foodItemTitle("Kacchi Biryani")
                .category(FoodCategory.COOKED)
                .quantityPortions(20)
                .initialPriceBDT(300.0)
                .skipAiAudit(false)
                .build();

        SurplusListing savedListing = SurplusListing.builder()
                .id(1L)
                .foodItemTitle("Kacchi Biryani")
                .quantityPortions(20)
                .build();

        when(surplusListingRepository.save(any(SurplusListing.class))).thenReturn(savedListing);

        SurplusResponseDto result = surplusListingService.createSurplusListing(request);
        assertNotNull(result);
        assertEquals(1L, result.getId());
    }
}
