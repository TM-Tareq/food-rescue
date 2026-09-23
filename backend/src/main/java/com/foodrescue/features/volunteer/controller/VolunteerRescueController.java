package com.foodrescue.features.volunteer.controller;

import com.foodrescue.features.volunteer.dto.*;
import com.foodrescue.features.volunteer.service.VolunteerRescueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/volunteer")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VolunteerRescueController {

    private final VolunteerRescueService volunteerRescueService;

    @PostMapping("/verify-otp")
    public ResponseEntity<OtpVerificationResponseDto> verifyOtp(@RequestBody VerifyOtpRequestDto request) {
        return ResponseEntity.ok(volunteerRescueService.verifyOtp(request));
    }

    @PostMapping("/sos-reassign")
    public ResponseEntity<SosResponseDto> triggerSos(@RequestBody SosReassignRequestDto request) {
        return ResponseEntity.ok(volunteerRescueService.triggerSosEmergency(request));
    }
}
