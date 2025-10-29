package com.example.fiberflow_backup.service;

import com.example.fiberflow_backup.dto.DeploymentLeadDashboardResponse;
import com.example.fiberflow_backup.dto.AvailableAssetDTO;
import com.example.fiberflow_backup.dto.AllocateAssetRequest;
import com.example.fiberflow_backup.dto.DeallocateAssetRequest;

import java.util.List;

public interface DeploymentLeadService {
    DeploymentLeadDashboardResponse getDashboardData();
    List<AvailableAssetDTO> getAvailableAssets(String assetType);
    void allocateAsset(AllocateAssetRequest request);
    void deallocateAsset(DeallocateAssetRequest request);
}
