package com.example.fiberflow_backup.controller;

import com.example.fiberflow_backup.dto.PlannerDashboardResponse;
import com.example.fiberflow_backup.service.PlannerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/planner")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Planner", description = "Network planning and capacity management APIs")
public class PlannerController {

    private final PlannerService plannerService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get planner dashboard", description = "Retrieve network planning metrics and capacity data")
    public ResponseEntity<PlannerDashboardResponse> getPlannerDashboard() {
        PlannerDashboardResponse dashboard = plannerService.getPlannerDashboard();
        return ResponseEntity.ok(dashboard);
    }
}
