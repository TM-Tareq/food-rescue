package com.foodrescue.features.admin.controller;

import com.foodrescue.common.dto.ApiResponse;
import com.foodrescue.features.admin.dto.PartnerApplicationRequestDto;
import com.foodrescue.features.admin.dto.PartnerStatusUpdateRequestDto;
import com.foodrescue.features.admin.model.PartnerApplication;
import com.foodrescue.features.admin.service.PartnerApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/partner-applications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PartnerApplicationController {

    private final PartnerApplicationService partnerApplicationService;

    @PostMapping("/submit")
    public ResponseEntity<ApiResponse<PartnerApplication>> submitApplication(@RequestBody PartnerApplicationRequestDto dto) {
        PartnerApplication result = partnerApplicationService.submitApplication(dto);
        return ResponseEntity.ok(ApiResponse.success(result, "Partner application submitted successfully for Super Admin audit."));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PartnerApplication>>> getAllApplications(
            @RequestParam(required = false) String roleType,
            @RequestParam(required = false) String status) {
        List<PartnerApplication> list = partnerApplicationService.getAllApplications(roleType, status);
        return ResponseEntity.ok(ApiResponse.success(list, "Fetched partner applications successfully."));
    }

    @PatchMapping("/{applicationId}/status")
    public ResponseEntity<ApiResponse<PartnerApplication>> updateStatus(
            @PathVariable String applicationId,
            @RequestBody PartnerStatusUpdateRequestDto statusDto) {
        PartnerApplication updated = partnerApplicationService.updateStatus(applicationId, statusDto);
        return ResponseEntity.ok(ApiResponse.success(updated, "Application status updated to " + updated.getStatus()));
    }
}
