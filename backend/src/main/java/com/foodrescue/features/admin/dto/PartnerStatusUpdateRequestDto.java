package com.foodrescue.features.admin.dto;

import lombok.Data;

@Data
public class PartnerStatusUpdateRequestDto {
    private String status; // APPROVED, REJECTED, NEEDS_REVISION
    private String feedbackReason;
}
