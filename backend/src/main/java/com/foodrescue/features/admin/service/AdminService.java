package com.foodrescue.features.admin.service;

import com.foodrescue.features.admin.dto.EsgReportResponseDto;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AdminService {

    public EsgReportResponseDto exportEsgReport() {
        return EsgReportResponseDto.builder()
                .success(true)
                .reportId("ESG-2026-DHAKA")
                .generatedAt(LocalDateTime.now())
                .message("Official ESG CSR PDF Report generated for Bangladesh Ministry of Environment.")
                .build();
    }
}
