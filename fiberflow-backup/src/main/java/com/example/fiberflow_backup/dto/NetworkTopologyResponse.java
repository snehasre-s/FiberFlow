package com.example.fiberflow_backup.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NetworkTopologyResponse {
    private HeadendDTO headend;
    private List<FDHDTO> fdhList;
    private NetworkMetrics metrics;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NetworkMetrics {
        private int totalSplitters;
        private int totalPorts;
        private int usedPorts;
        private int activeCustomers;
    }
}
