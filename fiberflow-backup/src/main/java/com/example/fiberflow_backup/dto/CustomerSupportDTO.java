package com.example.fiberflow_backup.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerSupportDTO {
    private Long customerId;
    private String name;
    private String neighborhood;
    private String plan;
    private String status;
}
