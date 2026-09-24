package com.foodrescue.features.admin.controller;

import com.foodrescue.features.admin.dto.EsgReportResponseDto;
import com.foodrescue.features.admin.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/esg-report")
    public ResponseEntity<EsgReportResponseDto> exportEsgReport() {
        return ResponseEntity.ok(adminService.exportEsgReport());
    }
}
