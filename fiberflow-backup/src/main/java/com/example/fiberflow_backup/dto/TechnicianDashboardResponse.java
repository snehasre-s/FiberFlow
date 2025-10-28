package com.example.fiberflow_backup.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TechnicianDashboardResponse {
    private TechnicianStats stats;
    private List<TechnicianTaskDTO> tasks;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TechnicianStats {
        private int pendingInstallations;
        private int tasksDueToday;
        private int upcomingAppointments;
        private int completedThisWeek;
    }
}
