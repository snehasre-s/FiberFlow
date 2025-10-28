package com.example.fiberflow_backup.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskDTO {
    private Long taskId;
    private String taskType;
    private String customerName;
    private String customerAddress;
    private String technicianName;
    private String description;
    private String status;
    private LocalDate scheduledDate;
}
