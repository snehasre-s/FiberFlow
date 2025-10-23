package com.example.fiberflow_backup.service;

import com.example.fiberflow_backup.dto.ActivityLogDTO;
import com.example.fiberflow_backup.dto.AdminDashboardDTO;
import com.example.fiberflow_backup.dto.DashboardStatsDTO;
import com.example.fiberflow_backup.dto.UserLogDTO;
import com.example.fiberflow_backup.model.ActivityLog;
import com.example.fiberflow_backup.model.Customer;
import com.example.fiberflow_backup.model.Task;
import com.example.fiberflow_backup.model.UserLog;
import com.example.fiberflow_backup.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    @Autowired
    AssetRepository assetRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    TaskRepository taskRepository;
    @Autowired
    CustomerRepository customerRepository;
    @Autowired
    ActivityLogRepository activityLogRepository;
    @Autowired
    UserLogRepository userLogRepository;

    public AdminDashboardDTO getDashboardData() {
        // Get statistics
        DashboardStatsDTO stats = new DashboardStatsDTO(
                assetRepository.count(),
                userRepository.count(),
                taskRepository.countByStatus(Task.TaskStatus.Pending),
                customerRepository.countByStatus(Customer.Status.Active)
        );

        // Get recent activities
        List<ActivityLogDTO> recentActivities = activityLogRepository
                .findTop10ByOrderByTimestampDesc()
                .stream()
                .map(this::convertToActivityLogDTO)
                .collect(Collectors.toList());

        // Get user logs
        List<UserLogDTO> userLogs = userLogRepository
                .findTop10ByOrderByLoginTimeDesc()
                .stream()
                .map(this::convertToUserLogDTO)
                .collect(Collectors.toList());

        return new AdminDashboardDTO(stats, recentActivities, userLogs);
    }

    private ActivityLogDTO convertToActivityLogDTO(ActivityLog log) {
        return new ActivityLogDTO(
                log.getId(),
                log.getUser().getUsername(),
                log.getAction(),
                log.getDetails(),
                log.getStatus() != null ? log.getStatus().name() : "Unknown",
                log.getTimestamp()
        );
    }

    private UserLogDTO convertToUserLogDTO(UserLog log) {
        return new UserLogDTO(
                log.getId(),
                log.getUser().getUsername(),
                log.getUser().getRole().name(),
                log.getLoginTime()
        );
    }
}
