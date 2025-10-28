package com.example.fiberflow_backup.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvailableAssetDTO {
    private Long assetId;
    private String serialNumber;
    private String model;
    private String location;
}
