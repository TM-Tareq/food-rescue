package com.foodrescue.features.admin;

import com.foodrescue.features.admin.dto.EsgReportResponseDto;
import com.foodrescue.features.admin.service.AdminService;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class AdminServiceTest {

    private final AdminService adminService = new AdminService();

    @Test
    void testExportEsgReportSuccess() {
        EsgReportResponseDto report = adminService.exportEsgReport();
        assertNotNull(report);
        assertTrue(report.getSuccess());
        assertEquals("ESG-2026-DHAKA", report.getReportId());
    }
}
