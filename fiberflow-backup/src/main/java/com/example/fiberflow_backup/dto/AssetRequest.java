package com.example.fiberflow_backup.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssetRequest {

    @NotBlank(message = "Asset ID is required")
    private String assetId;

    @NotBlank(message = "Asset type is required")
    private String type;

    @NotBlank(message = "Status is required")
    private String status;

    private String location;

    private String lastMaintenance;
}
