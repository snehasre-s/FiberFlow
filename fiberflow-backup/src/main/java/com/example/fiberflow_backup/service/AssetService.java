package com.example.fiberflow_backup.service;

import com.example.fiberflow_backup.dto.AssetRequest;
import com.example.fiberflow_backup.dto.AssetUpdateRequest;
import com.example.fiberflow_backup.model.Asset;

import java.util.List;
import java.util.Map;

public interface AssetService {
    List<Asset> getAllAssets();
    Asset getAssetById(Long id);
    Map<String, Long> getAssetStatistics();
    Asset createAsset(AssetRequest request);
    Asset updateAsset(Long id, AssetUpdateRequest request);
    void deleteAsset(Long id);
}
