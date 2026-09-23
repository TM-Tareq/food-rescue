package com.foodrescue.features.volunteer.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SosReassignRequestDto {
    private String missionId;
    private double[] riderLocation;
    private String reason;
}
