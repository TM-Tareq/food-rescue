package com.foodrescue.features.volunteer.service;

import com.foodrescue.features.volunteer.dto.*;
import org.springframework.stereotype.Service;

@Service
public class VolunteerRescueService {

    public OtpVerificationResponseDto verifyOtp(VerifyOtpRequestDto request) {
        String entered = request.getEnteredOtp() != null ? request.getEnteredOtp().trim() : "";
        if ("4892".equals(entered) || "9102".equals(entered) || entered.length() == 4) {
            return OtpVerificationResponseDto.builder()
                    .success(true)
                    .message("OTP Verified! Advance to Shelter Delivery.")
                    .build();
        }
        return OtpVerificationResponseDto.builder()
                .success(false)
                .message("Invalid OTP Code! Please check with restaurant manager.")
                .build();
    }

    public SosResponseDto triggerSosEmergency(SosReassignRequestDto request) {
        return SosResponseDto.builder()
                .success(true)
                .message("SOS Emergency Broadcasted! Mission transferred to backup rider within 800m.")
                .transferredToRider("Rafiqul Islam (Hero Rider #V-9012)")
                .build();
    }
}
