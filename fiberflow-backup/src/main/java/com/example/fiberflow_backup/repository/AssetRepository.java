package com.example.fiberflow_backup.repository;

import com.example.fiberflow_backup.model.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {
    long countByStatus(Asset.AssetStatus status);
    long countByTypeAndStatus(Asset.AssetType type, Asset.AssetStatus status);
    Optional<Asset> findByAssetId(String assetId);
}
