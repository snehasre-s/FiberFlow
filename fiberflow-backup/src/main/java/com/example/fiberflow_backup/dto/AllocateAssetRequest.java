package com.example.fiberflow_backup.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AllocateAssetRequest {

    @NotNull(message = "Customer ID is required")
    private Long customerId;

    @NotNull(message = "Asset ID is required")
    private Long assetId;

    private String assetType;
}
