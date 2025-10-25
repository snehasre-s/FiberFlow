package com.example.fiberflow_backup.repository;

import com.example.fiberflow_backup.enums.AssetStatus;
import com.example.fiberflow_backup.enums.AssetType;
import com.example.fiberflow_backup.model.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {
    long countByStatus(AssetStatus status);
    long countByAssetType(AssetType assetType);  // ADD THIS LINE
    long countByAssetTypeAndStatus(AssetType assetType, AssetStatus status);
    Optional<Asset> findBySerialNumber(String serialNumber);
}

