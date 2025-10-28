package com.example.fiberflow_backup.service;

import com.example.fiberflow_backup.dto.AssetRequest;
import com.example.fiberflow_backup.dto.AssetUpdateRequest;
import com.example.fiberflow_backup.enums.AssetStatus;
import com.example.fiberflow_backup.enums.AssetType;
import com.example.fiberflow_backup.model.Asset;
import com.example.fiberflow_backup.model.AuditLog;
import com.example.fiberflow_backup.model.User;
import com.example.fiberflow_backup.repository.AssetRepository;
import com.example.fiberflow_backup.repository.AuditLogRepository;
import com.example.fiberflow_backup.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AssetService {

    private final AssetRepository assetRepository;
    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    public List<Asset> getAllAssets() {
        return assetRepository.findAll();
    }

    public Asset getAssetById(Long id) {
        return assetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found with id: " + id));
    }

    public Map<String, Long> getAssetStatistics() {
        Map<String, Long> stats = new HashMap<>();

        for (AssetType type : AssetType.values()) {
            String key = type.name().substring(0, 1).toLowerCase() +
                    type.name().substring(1);
            stats.put(key, assetRepository.countByAssetType(type));
        }

        return stats;
    }

    @Transactional
    public Asset createAsset(AssetRequest request) {
        // Check if serial number already exists
        if (assetRepository.findBySerialNumber(request.getSerialNumber()).isPresent()) {
            throw new RuntimeException("Asset with serial number " + request.getSerialNumber() + " already exists");
        }

        Asset asset = new Asset();
        asset.setAssetType(AssetType.valueOf(request.getAssetType()));
        asset.setModel(request.getModel());
        asset.setSerialNumber(request.getSerialNumber());
        asset.setStatus(AssetStatus.valueOf(request.getStatus()));
        asset.setLocation(request.getLocation());
        asset.setAssignedToCustomerId(null);
        asset.setAssignedDate(null);

        Asset savedAsset = assetRepository.save(asset);

        // Log activity
        logActivity("ASSET_CREATED",
                "Created new asset: " + savedAsset.getAssetType() + " - " + savedAsset.getSerialNumber());

        return savedAsset;
    }

    @Transactional
    public Asset updateAsset(Long id, AssetUpdateRequest request) {
        Asset asset = getAssetById(id);

        // Don't allow status change if assigned (should use deallocate instead)
        if (asset.getStatus() == AssetStatus.Assigned &&
                !request.getStatus().equals("Assigned")) {
            throw new RuntimeException("Cannot change status of assigned asset. Please deallocate first.");
        }

        asset.setModel(request.getModel());
        asset.setStatus(AssetStatus.valueOf(request.getStatus()));
        asset.setLocation(request.getLocation());

        Asset updatedAsset = assetRepository.save(asset);

        // Log activity
        logActivity("ASSET_UPDATED",
                "Updated asset: " + updatedAsset.getSerialNumber() + " | Status: " + updatedAsset.getStatus());

        return updatedAsset;
    }

    @Transactional
    public void deleteAsset(Long id) {
        Asset asset = getAssetById(id);

        // Don't allow deletion of assigned assets
        if (asset.getStatus() == AssetStatus.Assigned) {
            throw new RuntimeException("Cannot delete assigned asset. Please deallocate first.");
        }

        String serialNumber = asset.getSerialNumber();
        String assetType = asset.getAssetType().name();

        assetRepository.deleteById(id);

        // Log activity
        logActivity("ASSET_DELETED",
                "Deleted asset: " + assetType + " - " + serialNumber);
    }

    private void logActivity(String actionType, String description) {
        try {
            User admin = userRepository.findByUsername("admin").orElse(null);
            if (admin != null) {
                AuditLog log = new AuditLog();
                log.setUser(admin);
                log.setActionType(actionType);
                log.setDescription(description);
                log.setTimestamp(LocalDateTime.now());
                auditLogRepository.save(log);
            }
        } catch (Exception e) {
            System.err.println("Failed to log activity: " + e.getMessage());
        }
    }
}
