package com.example.fiberflow_backup.controller;

import com.example.fiberflow_backup.dto.AdminDashboardDTO;
import com.example.fiberflow_backup.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardDTO> getDashboard() {
        AdminDashboardDTO dashboard = adminService.getDashboardData();
        return ResponseEntity.ok(dashboard);
    }
}
