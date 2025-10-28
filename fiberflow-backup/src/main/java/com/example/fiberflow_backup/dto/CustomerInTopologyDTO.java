package com.example.fiberflow_backup.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerInTopologyDTO {
    private Long customerId;
    private String name;
    private String plan;
    private Integer assignedPort;
    private String status;
}
