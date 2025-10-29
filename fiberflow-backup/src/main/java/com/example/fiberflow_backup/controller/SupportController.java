package com.example.fiberflow_backup.controller;

import com.example.fiberflow_backup.dto.CustomerDetailDTO;
import com.example.fiberflow_backup.dto.SupportDashboardResponse;
import com.example.fiberflow_backup.service.SupportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/support")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Support", description = "Customer support and ticket management APIs")
public class SupportController {

    private final SupportService supportService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get support dashboard", description = "Retrieve support metrics and customer data")
    public ResponseEntity<SupportDashboardResponse> getSupportDashboard() {
        SupportDashboardResponse dashboard = supportService.getSupportDashboard();
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/customer/{customerId}")
    @Operation(summary = "Get customer details", description = "Retrieve detailed information about a specific customer")
    public ResponseEntity<?> getCustomerDetail(@PathVariable Long customerId) {
        try {
            CustomerDetailDTO customer = supportService.getCustomerDetail(customerId);
            return ResponseEntity.ok(customer);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ErrorResponse(e.getMessage())
            );
        }
    }

    record ErrorResponse(String message) {}
}
