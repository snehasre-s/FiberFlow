package com.example.fiberflow_backup.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivityLogDTO {
    private Long id;
    private String username;
    private String action;
    private String details;
    private String status;
    private LocalDateTime timestamp;
}
