package com.example.fiberflow_backup.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FieldEngineerDashboardResponse {
    private FieldEngineerStats stats;
    private List<CustomerDTO> recentCustomers;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FieldEngineerStats {
        private long todayCreated;
        private long weekCreated;
        private long pendingActivation;
    }
}
