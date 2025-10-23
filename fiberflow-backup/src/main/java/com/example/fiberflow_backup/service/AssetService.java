package com.example.fiberflow_backup.service;

import com.example.fiberflow_backup.dto.AssetRequest;
import com.example.fiberflow_backup.dto.AssetStatsDTO;
import com.example.fiberflow_backup.model.ActivityLog;
import com.example.fiberflow_backup.model.Asset;
import com.example.fiberflow_backup.model.User;
import com.example.fiberflow_backup.repository.ActivityLogRepository;
import com.example.fiberflow_backup.repository.AssetRepository;
import com.example.fiberflow_backup.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AssetService {

    private final AssetRepository assetRepository;
    private final ActivityLogRepository activityLogRepository;
    private final UserRepository userRepository;

    public List<Asset> getAllAssets() {
        return assetRepository.findAll();
    }

    public Asset getAssetById(Long id) {
        return assetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found with id: " + id));
    }

    @Transactional
    public Asset createAsset(AssetRequest request) {
        // Check if asset ID already exists
        if (assetRepository.findByAssetId(request.getAssetId()).isPresent()) {
            throw new RuntimeException("Asset ID already exists");
        }

        Asset asset = new Asset();
        asset.setAssetId(request.getAssetId());
        asset.setType(Asset.AssetType.valueOf(request.getType()));
        asset.setStatus(Asset.AssetStatus.valueOf(request.getStatus()));
        asset.setLocation(request.getLocation());

        if (request.getLastMaintenance() != null && !request.getLastMaintenance().isEmpty()) {
            asset.setLastMaintenance(LocalDateTime.parse(request.getLastMaintenance() + "T00:00:00"));
        }

        asset.setCreatedAt(LocalDateTime.now());

        Asset savedAsset = assetRepository.save(asset);

        // Log activity
        logActivity("Asset Created", "Created asset: " + savedAsset.getAssetId() +
                " (" + savedAsset.getType() + ")");

        return savedAsset;
    }

    @Transactional
    public Asset updateAsset(Long id, AssetRequest request) {
        Asset asset = getAssetById(id);

        asset.setType(Asset.AssetType.valueOf(request.getType()));
        asset.setStatus(Asset.AssetStatus.valueOf(request.getStatus()));
        asset.setLocation(request.getLocation());

        if (request.getLastMaintenance() != null && !request.getLastMaintenance().isEmpty()) {
            asset.setLastMaintenance(LocalDateTime.parse(request.getLastMaintenance() + "T00:00:00"));
        }

        Asset updatedAsset = assetRepository.save(asset);

        // Log activity
        logActivity("Asset Updated", "Updated asset: " + updatedAsset.getAssetId() +
                " | Status: " + updatedAsset.getStatus());

        return updatedAsset;
    }

    @Transactional
    public void deleteAsset(Long id) {
        Asset asset = getAssetById(id);

        // Log activity before deletion
        logActivity("Asset Deleted", "Deleted asset: " + asset.getAssetId() +
                " (" + asset.getType() + ")");

        assetRepository.deleteById(id);
    }

    public AssetStatsDTO getAssetStatistics() {
        AssetStatsDTO stats = new AssetStatsDTO();

        // FDH Stats
        stats.setFdh(new AssetStatsDTO.AssetTypeStats(
                assetRepository.countByTypeAndStatus(Asset.AssetType.FDH, Asset.AssetStatus.Available),
                assetRepository.countByTypeAndStatus(Asset.AssetType.FDH, Asset.AssetStatus.Assigned),
                assetRepository.countByTypeAndStatus(Asset.AssetType.FDH, Asset.AssetStatus.Defective),
                assetRepository.countByTypeAndStatus(Asset.AssetType.FDH, Asset.AssetStatus.Maintenance)
        ));

        // ONT Stats
        stats.setOnt(new AssetStatsDTO.AssetTypeStats(
                assetRepository.countByTypeAndStatus(Asset.AssetType.ONT, Asset.AssetStatus.Available),
                assetRepository.countByTypeAndStatus(Asset.AssetType.ONT, Asset.AssetStatus.Assigned),
                assetRepository.countByTypeAndStatus(Asset.AssetType.ONT, Asset.AssetStatus.Defective),
                assetRepository.countByTypeAndStatus(Asset.AssetType.ONT, Asset.AssetStatus.Maintenance)
        ));

        // Router Stats
        stats.setRouter(new AssetStatsDTO.AssetTypeStats(
                assetRepository.countByTypeAndStatus(Asset.AssetType.Router, Asset.AssetStatus.Available),
                assetRepository.countByTypeAndStatus(Asset.AssetType.Router, Asset.AssetStatus.Assigned),
                assetRepository.countByTypeAndStatus(Asset.AssetType.Router, Asset.AssetStatus.Defective),
                assetRepository.countByTypeAndStatus(Asset.AssetType.Router, Asset.AssetStatus.Maintenance)
        ));

        // Splitter Stats
        stats.setSplitter(new AssetStatsDTO.AssetTypeStats(
                assetRepository.countByTypeAndStatus(Asset.AssetType.Splitter, Asset.AssetStatus.Available),
                assetRepository.countByTypeAndStatus(Asset.AssetType.Splitter, Asset.AssetStatus.Assigned),
                assetRepository.countByTypeAndStatus(Asset.AssetType.Splitter, Asset.AssetStatus.Defective),
                assetRepository.countByTypeAndStatus(Asset.AssetType.Splitter, Asset.AssetStatus.Maintenance)
        ));

        // Cable Stats
        stats.setCable(new AssetStatsDTO.AssetTypeStats(
                assetRepository.countByTypeAndStatus(Asset.AssetType.Cable, Asset.AssetStatus.Available),
                assetRepository.countByTypeAndStatus(Asset.AssetType.Cable, Asset.AssetStatus.Assigned),
                assetRepository.countByTypeAndStatus(Asset.AssetType.Cable, Asset.AssetStatus.Defective),
                assetRepository.countByTypeAndStatus(Asset.AssetType.Cable, Asset.AssetStatus.Maintenance)
        ));

        return stats;
    }

    private void logActivity(String action, String details) {
        try {
            User admin = userRepository.findByUsername("admin").orElse(null);
            if (admin != null) {
                ActivityLog log = new ActivityLog();
                log.setUser(admin);
                log.setAction(action);
                log.setDetails(details);
                log.setStatus(ActivityLog.LogStatus.Success);
                log.setTimestamp(LocalDateTime.now());
                activityLogRepository.save(log);
            }
        } catch (Exception e) {
            // Log silently, don't break the main operation
            System.err.println("Failed to log activity: " + e.getMessage());
        }
    }
}