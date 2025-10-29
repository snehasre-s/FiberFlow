package com.example.fiberflow_backup.controller;

import com.example.fiberflow_backup.dto.AssetRequest;
import com.example.fiberflow_backup.dto.AssetUpdateRequest;
import com.example.fiberflow_backup.model.Asset;
import com.example.fiberflow_backup.serviceimpl.AssetServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assets")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Asset Management", description = "APIs for managing network assets")
public class AssetController {

    private final AssetServiceImpl assetServiceImpl;

    @GetMapping
    @Operation(summary = "Get all assets", description = "Retrieve a list of all network assets")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved assets")
    public ResponseEntity<List<Asset>> getAllAssets() {
        return ResponseEntity.ok(assetServiceImpl.getAllAssets());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get asset by ID", description = "Retrieve a specific asset by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Asset found"),
            @ApiResponse(responseCode = "404", description = "Asset not found")
    })
    public ResponseEntity<?> getAssetById(
            @Parameter(description = "Asset ID") @PathVariable Long id) {
        try {
            return ResponseEntity.ok(assetServiceImpl.getAssetById(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/stats")
    @Operation(summary = "Get asset statistics", description = "Get count of assets by type")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved statistics")
    public ResponseEntity<Map<String, Long>> getAssetStatistics() {
        return ResponseEntity.ok(assetServiceImpl.getAssetStatistics());
    }

    @PostMapping
    @Operation(summary = "Create new asset", description = "Add a new asset to the inventory")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Asset created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input or serial number already exists")
    })
    public ResponseEntity<?> createAsset(@Valid @RequestBody AssetRequest request) {
        try {
            Asset asset = assetServiceImpl.createAsset(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(asset);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update asset", description = "Update an existing asset's information")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Asset updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "404", description = "Asset not found")
    })
    public ResponseEntity<?> updateAsset(
            @Parameter(description = "Asset ID") @PathVariable Long id,
            @Valid @RequestBody AssetUpdateRequest request) {
        try {
            Asset asset = assetServiceImpl.updateAsset(id, request);
            return ResponseEntity.ok(asset);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete asset", description = "Remove an asset from the inventory")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Asset deleted successfully"),
            @ApiResponse(responseCode = "400", description = "Cannot delete assigned asset"),
            @ApiResponse(responseCode = "404", description = "Asset not found")
    })
    public ResponseEntity<?> deleteAsset(
            @Parameter(description = "Asset ID") @PathVariable Long id) {
        try {
            assetServiceImpl.deleteAsset(id);
            return ResponseEntity.ok(new SuccessResponse("Asset deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    record ErrorResponse(String message) {}
    record SuccessResponse(String message) {}
}
