package com.foodrescue.features.admin.dto;

import lombok.Data;

@Data
public class PartnerApplicationRequestDto {
    private String name;
    private String ownerName;
    private String email;
    private String phone;
    private String address;
    private String roleType; // RESTAURANT, NGO, RIDER

    // Restaurant
    private String tradeLicenseNo;
    private String tinNo;
    private String bstiCertNo;
    private String bankAccount;

    // NGO
    private String ngoRegNo;
    private String taxExemptNo;
    private String dailyCapacity;
    private String coveredLocations;

    // Rider
    private String nidNo;
    private String drivingLicenseNo;
    private String vehicleType;
    private String emergencyContact;

    // Docs
    private String docUrl;
    private String uploadedDocName;
}
