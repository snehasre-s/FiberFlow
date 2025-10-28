package com.example.fiberflow_backup.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeploymentLeadDashboardResponse {
    private DeploymentLeadStats stats;
    private List<CustomerWithAssetsDTO> customers;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DeploymentLeadStats {
        private long totalCustomers;
        private long assetsAllocated;
        private long availableAssets;
        private long pendingAllocations;
    }
}
