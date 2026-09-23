package com.foodrescue.features.volunteer.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VerifyOtpRequestDto {
    private String missionId;
    private String enteredOtp;
}
