package com.example.fiberflow_backup.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardDTO {
    private DashboardStatsDTO stats;
    private List<ActivityLogDTO> recentActivities;
    private List<UserLogDTO> userLogs;
}
