package com.example.fiberflow_backup.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerOnboardingResponse {
    private Long id;
    private String customerId;
    private String name;
    private String email;
    private String status;
    private Long taskId;
    private String message;
}
