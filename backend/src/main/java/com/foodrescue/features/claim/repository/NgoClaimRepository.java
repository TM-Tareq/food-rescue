package com.foodrescue.features.claim.repository;

import com.foodrescue.features.claim.model.ClaimStatus;
import com.foodrescue.features.claim.model.NgoClaim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NgoClaimRepository extends JpaRepository<NgoClaim, Long> {
    List<NgoClaim> findByNgoId(String ngoId);
    List<NgoClaim> findByNgoIdAndStatus(String ngoId, ClaimStatus status);
}
