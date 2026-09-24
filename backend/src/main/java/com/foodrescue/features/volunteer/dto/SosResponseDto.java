package com.foodrescue.features.volunteer.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SosResponseDto {
    private Boolean success;
    private String message;
    private String transferredToRider;
}
