package com.foodrescue.features.volunteer.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OtpVerificationResponseDto {
    private Boolean success;
    private String message;
}
