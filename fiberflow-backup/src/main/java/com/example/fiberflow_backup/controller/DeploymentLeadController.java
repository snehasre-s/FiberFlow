package com.example.fiberflow_backup.controller;

import com.example.fiberflow_backup.dto.*;
import com.example.fiberflow_backup.serviceimpl.DeploymentLeadServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deployment-lead")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Deployment Lead", description = "Asset allocation and management APIs")
public class DeploymentLeadController {

    private final DeploymentLeadServiceImpl deploymentLeadServiceImpl;

    @GetMapping("/dashboard")
    @Operation(summary = "Get deployment lead dashboard", description = "Retrieve dashboard with customers and asset allocation data")
    public ResponseEntity<DeploymentLeadDashboardResponse> getDashboard() {
        DeploymentLeadDashboardResponse dashboard = deploymentLeadServiceImpl.getDashboardData();
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/available-assets")
    @Operation(summary = "Get available assets", description = "Get list of available assets by type")
    public ResponseEntity<List<AvailableAssetDTO>> getAvailableAssets(
            @RequestParam String type) {
        List<AvailableAssetDTO> assets = deploymentLeadServiceImpl.getAvailableAssets(type);
        return ResponseEntity.ok(assets);
    }

    @PostMapping("/allocate-asset")
    @Operation(summary = "Allocate asset to customer", description = "Assign an available asset to a customer")
    public ResponseEntity<?> allocateAsset(@Valid @RequestBody AllocateAssetRequest request) {
        try {
            deploymentLeadServiceImpl.allocateAsset(request);
            return ResponseEntity.ok(new SuccessResponse("Asset allocated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ErrorResponse(e.getMessage())
            );
        }
    }

    @PostMapping("/deallocate-asset")
    @Operation(summary = "Deallocate asset from customer", description = "Remove asset allocation and return it to inventory")
    public ResponseEntity<?> deallocateAsset(@Valid @RequestBody DeallocateAssetRequest request) {
        try {
            deploymentLeadServiceImpl.deallocateAsset(request);
            return ResponseEntity.ok(new SuccessResponse("Asset deallocated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ErrorResponse(e.getMessage())
            );
        }
    }

    record ErrorResponse(String message) {}
    record SuccessResponse(String message) {}
}
