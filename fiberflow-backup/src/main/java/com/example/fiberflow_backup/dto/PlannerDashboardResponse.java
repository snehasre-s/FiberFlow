package com.example.fiberflow_backup.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlannerDashboardResponse {
    private NetworkMetrics networkMetrics;
    private List<RegionalData> regionalData;
    private List<FDHCapacityData> capacityData;
    private List<RecentActivity> recentActivities;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NetworkMetrics {
        private int totalFDH;
        private int totalSplitters;
        private int totalPorts;
        private int usedPorts;
        private int activeConnections;
        private int faults;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegionalData {
        private String name;
        private int connections;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FDHCapacityData {
        private Long fdhId;
        private String name;
        private String region;
        private int splitterCount;
        private int totalCapacity;
        private int usedPorts;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentActivity {
        private String action;
        private String description;
        private String timestamp;
    }
}
