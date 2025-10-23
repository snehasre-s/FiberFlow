package com.example.fiberflow_backup.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssetStatsDTO {
    private AssetTypeStats fdh;
    private AssetTypeStats ont;
    private AssetTypeStats router;
    private AssetTypeStats splitter;
    private AssetTypeStats cable;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AssetTypeStats {
        private long available;
        private long assigned;
        private long defective;
        private long maintenance;
    }
}
