package com.foodrescue.features.admin.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EsgReportResponseDto {
    private Boolean success;
    private String reportId;
    private LocalDateTime generatedAt;
    private String message;
}
