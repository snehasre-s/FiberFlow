package com.example.fiberflow_backup.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AllocatedAssetDTO {
    private Long assetId;
    private String assetType;
    private String serialNumber;
    private String model;
}
