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
                .foodItemTitle("Royal Kacchi Biryani")
                .category(FoodCategory.COOKED)
                .quantityPortions(25)
                .initialPriceBDT(350.0)
                .skipAiAudit(false)
                .build();

        SurplusListing saved = SurplusListing.builder()
                .id(101L)
                .foodItemTitle("Royal Kacchi Biryani")
                .quantityPortions(25)
                .build();

        when(surplusListingRepository.save(any(SurplusListing.class))).thenReturn(saved);

        SurplusResponseDto response = surplusListingService.createSurplusListing(request);
        assertNotNull(response);
        assertEquals(101L, response.getId());
    }
}
