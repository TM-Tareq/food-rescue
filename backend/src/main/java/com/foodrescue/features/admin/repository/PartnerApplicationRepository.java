package com.foodrescue.features.admin.repository;

import com.foodrescue.features.admin.model.PartnerApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PartnerApplicationRepository extends JpaRepository<PartnerApplication, Long> {
    Optional<PartnerApplication> findByApplicationId(String applicationId);
    List<PartnerApplication> findByRoleType(String roleType);
    List<PartnerApplication> findByStatus(String status);
    List<PartnerApplication> findByRoleTypeAndStatus(String roleType, String status);
}
