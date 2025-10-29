package com.example.fiberflow_backup.controller;

import com.example.fiberflow_backup.dto.TechnicianDashboardResponse;
import com.example.fiberflow_backup.serviceimpl.TechnicianServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/technician")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Technician", description = "Technician dashboard and task management APIs")
public class TechnicianController {

    private final TechnicianServiceImpl technicianServiceImpl;

    @GetMapping("/dashboard")
    @Operation(summary = "Get technician dashboard", description = "Retrieve technician dashboard with tasks and stats")
    public ResponseEntity<TechnicianDashboardResponse> getTechnicianDashboard() {
        TechnicianDashboardResponse dashboard = technicianServiceImpl.getTechnicianDashboard();
        return ResponseEntity.ok(dashboard);
    }
}
