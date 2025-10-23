package com.example.fiberflow_backup.controller;

import com.example.fiberflow_backup.dto.AssetRequest;
import com.example.fiberflow_backup.dto.AssetStatsDTO;
import com.example.fiberflow_backup.model.Asset;
import com.example.fiberflow_backup.service.AssetService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Asset Management", description = "APIs for managing network assets (FDH, ONT, Router, Splitter, Cable)")
public class AssetController {

    private final AssetService assetService;

    @GetMapping
    public ResponseEntity<List<Asset>> getAllAssets() {
        return ResponseEntity.ok(assetService.getAllAssets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAssetById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(assetService.getAssetById(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<AssetStatsDTO> getAssetStatistics() {
        return ResponseEntity.ok(assetService.getAssetStatistics());
    }

    @PostMapping
    public ResponseEntity<?> createAsset(@Valid @RequestBody AssetRequest request) {
        try {
            Asset asset = assetService.createAsset(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(asset);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAsset(@PathVariable Long id,
                                         @Valid @RequestBody AssetRequest request) {
        try {
            Asset asset = assetService.updateAsset(id, request);
            return ResponseEntity.ok(asset);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAsset(@PathVariable Long id) {
        try {
            assetService.deleteAsset(id);
            return ResponseEntity.ok(new SuccessResponse("Asset deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    record ErrorResponse(String message) {}
    record SuccessResponse(String message) {}
}