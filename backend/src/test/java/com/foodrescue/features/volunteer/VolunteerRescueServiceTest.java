package com.foodrescue.features.volunteer;

import com.foodrescue.features.volunteer.dto.*;
import com.foodrescue.features.volunteer.service.VolunteerRescueService;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class VolunteerRescueServiceTest {

    private final VolunteerRescueService volunteerRescueService = new VolunteerRescueService();

    @Test
    void testVerifyOtpValidCode() {
        VerifyOtpRequestDto request = new VerifyOtpRequestDto("RESCUE-8091", "4892");
        OtpVerificationResponseDto response = volunteerRescueService.verifyOtp(request);

        assertTrue(response.getSuccess());
        assertEquals("OTP Verified! Advance to Shelter Delivery.", response.getMessage());
    }

    @Test
    void testTriggerSosEmergencySuccess() {
        SosReassignRequestDto request = new SosReassignRequestDto("RESCUE-8091", new double[]{23.79, 90.40}, "BREAKDOWN");
        SosResponseDto response = volunteerRescueService.triggerSosEmergency(request);

        assertTrue(response.getSuccess());
        assertNotNull(response.getTransferredToRider());
    }
}
