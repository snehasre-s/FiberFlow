package com.example.fiberflow_backup.controller;

import com.example.fiberflow_backup.dto.CreateCustomerRequest;
import com.example.fiberflow_backup.dto.CreateCustomerResponse;
import com.example.fiberflow_backup.dto.FieldEngineerDashboardResponse;
import com.example.fiberflow_backup.service.FieldEngineerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/field-engineer")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Field Engineer", description = "Field engineer dashboard and customer creation APIs")
public class FieldEngineerController {

    private final FieldEngineerService fieldEngineerService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get field engineer dashboard", description = "Retrieve dashboard data with stats and recent customers")
    public ResponseEntity<FieldEngineerDashboardResponse> getDashboard() {
        FieldEngineerDashboardResponse dashboard = fieldEngineerService.getDashboardData();
        return ResponseEntity.ok(dashboard);
    }

    @PostMapping("/create-customer")
    @Operation(summary = "Create new customer", description = "Create a new customer profile")
    public ResponseEntity<?> createCustomer(@Valid @RequestBody CreateCustomerRequest request) {
        try {
            CreateCustomerResponse response = fieldEngineerService.createCustomer(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ErrorResponse("Failed to create customer: " + e.getMessage())
            );
        }
    }

    record ErrorResponse(String message) {}
}
