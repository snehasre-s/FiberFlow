package com.example.fiberflow_backup.controller;

import com.example.fiberflow_backup.dto.AdminDashboardResponse;
import com.example.fiberflow_backup.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Admin", description = "Admin dashboard and management APIs")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get admin dashboard", description = "Retrieve admin dashboard data with stats and recent activity")
    public ResponseEntity<AdminDashboardResponse> getDashboard() {
        AdminDashboardResponse dashboard = adminService.getDashboardData();
        return ResponseEntity.ok(dashboard);
    }
}
