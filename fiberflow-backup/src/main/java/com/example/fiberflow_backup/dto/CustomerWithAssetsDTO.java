package com.example.fiberflow_backup.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerWithAssetsDTO {
    private Long customerId;
    private String name;
    private String neighborhood;
    private String plan;
    private String status;
    private List<AllocatedAssetDTO> allocatedAssets;
}
