package com.example.fiberflow_backup.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SplitterDTO {
    private Long splitterId;
    private String model;
    private Integer portCapacity;
    private Integer usedPorts;
    private String location;
    private List<CustomerInTopologyDTO> customers;
}
