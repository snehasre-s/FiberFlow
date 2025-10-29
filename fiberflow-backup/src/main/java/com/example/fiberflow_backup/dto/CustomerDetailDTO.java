package com.example.fiberflow_backup.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDetailDTO {
    private Long customerId;
    private String name;
    private String address;
    private String neighborhood;
    private String plan;
    private String connectionType;
    private String status;
    private Integer assignedPort;
    private LocalDateTime createdAt;
    private SplitterInfo splitterInfo;
    private List<AssetInfo> assignedAssets;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SplitterInfo {
        private Long splitterId;
        private String model;
        private String location;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AssetInfo {
        private Long assetId;
        private String assetType;
        private String serialNumber;
        private String model;
    }
}
