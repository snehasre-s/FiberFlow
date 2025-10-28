package com.example.fiberflow_backup.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TechnicianSimpleDTO {
    private Long technicianId;
    private String name;
    private String contact;
    private String region;
}
