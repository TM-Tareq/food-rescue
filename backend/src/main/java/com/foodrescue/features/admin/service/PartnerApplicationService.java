package com.foodrescue.features.admin.service;

import com.foodrescue.common.exception.ResourceNotFoundException;
import com.foodrescue.features.admin.dto.PartnerApplicationRequestDto;
import com.foodrescue.features.admin.dto.PartnerStatusUpdateRequestDto;
import com.foodrescue.features.admin.model.PartnerApplication;
import com.foodrescue.features.admin.repository.PartnerApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class PartnerApplicationService {

    private final PartnerApplicationRepository partnerApplicationRepository;

    @Transactional
    public PartnerApplication submitApplication(PartnerApplicationRequestDto dto) {
        String rolePrefix = dto.getRoleType() != null ? dto.getRoleType().toUpperCase() : "PARTNER";
        String appId = "APP-" + rolePrefix + "-2026-" + (1000 + new Random().nextInt(9000));

        PartnerApplication app = PartnerApplication.builder()
                .applicationId(appId)
                .name(dto.getName())
                .ownerName(dto.getOwnerName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .address(dto.getAddress())
                .roleType(dto.getRoleType())
                .tradeLicenseNo(dto.getTradeLicenseNo())
                .tinNo(dto.getTinNo())
                .bstiCertNo(dto.getBstiCertNo())
                .bankAccount(dto.getBankAccount())
                .ngoRegNo(dto.getNgoRegNo())
                .taxExemptNo(dto.getTaxExemptNo())
                .dailyCapacity(dto.getDailyCapacity())
                .coveredLocations(dto.getCoveredLocations())
                .nidNo(dto.getNidNo())
                .drivingLicenseNo(dto.getDrivingLicenseNo())
                .vehicleType(dto.getVehicleType())
                .emergencyContact(dto.getEmergencyContact())
                .docUrl(dto.getDocUrl())
                .uploadedDocName(dto.getUploadedDocName())
                .status("PENDING")
                .build();

        return partnerApplicationRepository.save(app);
    }

    public List<PartnerApplication> getAllApplications(String roleType, String status) {
        if (roleType != null && !roleType.equalsIgnoreCase("ALL") && status != null) {
            return partnerApplicationRepository.findByRoleTypeAndStatus(roleType.toUpperCase(), status.toUpperCase());
        } else if (roleType != null && !roleType.equalsIgnoreCase("ALL")) {
            return partnerApplicationRepository.findByRoleType(roleType.toUpperCase());
        } else if (status != null) {
            return partnerApplicationRepository.findByStatus(status.toUpperCase());
        }
        return partnerApplicationRepository.findAll();
    }

    @Transactional
    public PartnerApplication updateStatus(String applicationId, PartnerStatusUpdateRequestDto dto) {
        PartnerApplication app = partnerApplicationRepository.findByApplicationId(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Partner application not found with ID: " + applicationId));

        app.setStatus(dto.getStatus().toUpperCase());
        if (dto.getFeedbackReason() != null) {
            app.setFeedbackReason(dto.getFeedbackReason());
        }

        return partnerApplicationRepository.save(app);
    }
}
