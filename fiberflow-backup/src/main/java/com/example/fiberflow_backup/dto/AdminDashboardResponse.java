package com.example.fiberflow_backup.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {
    private DashboardStats stats;
    private List<AuditLogDTO> recentAuditLogs;
    private Map<String, Long> assetSummary;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DashboardStats {
        private long totalCustomers;
        private long totalAssets;
        private long pendingTasks;
        private long activeTechnicians;
    }
}
