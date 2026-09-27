package com.foodrescue.features.admin.model;

import com.foodrescue.common.model.BaseAuditableEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "partner_applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PartnerApplication extends BaseAuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 64)
    private String applicationId;

    @Column(nullable = false, length = 128)
    private String name;

    @Column(nullable = false, length = 128)
    private String ownerName;

    @Column(nullable = false, length = 128)
    private String email;

    @Column(nullable = false, length = 32)
    private String phone;

    @Column(length = 256)
    private String address;

    @Column(nullable = false, length = 32)
    private String roleType; // RESTAURANT, NGO, RIDER

    // Restaurant fields
    private String tradeLicenseNo;
    private String tinNo;
    private String bstiCertNo;
    private String bankAccount;

    // NGO fields
    private String ngoRegNo;
    private String taxExemptNo;
    private String dailyCapacity;
    private String coveredLocations;

    // Rider fields
    private String nidNo;
    private String drivingLicenseNo;
    private String vehicleType;
    private String emergencyContact;

    // Document attachments (Stored as LONGTEXT in MySQL for Base64 Data URLs)
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String docUrl;
    private String uploadedDocName;

    @Column(nullable = false, length = 32)
    private String status; // PENDING, APPROVED, REJECTED, NEEDS_REVISION

    @Column(length = 512)
    private String feedbackReason;
}
