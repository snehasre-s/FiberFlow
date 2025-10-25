package com.example.fiberflow_backup.service;

import com.example.fiberflow_backup.dto.AdminDashboardResponse;
import com.example.fiberflow_backup.dto.AdminDashboardResponse.DashboardStats;
import com.example.fiberflow_backup.dto.AuditLogDTO;
import com.example.fiberflow_backup.enums.AssetType;
import com.example.fiberflow_backup.enums.TaskStatus;
import com.example.fiberflow_backup.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final CustomerRepository customerRepository;
    private final AssetRepository assetRepository;
    private final DeploymentTaskRepository deploymentTaskRepository;
    private final TechnicianRepository technicianRepository;
    private final AuditLogRepository auditLogRepository;

    public AdminDashboardResponse getDashboardData() {
        // Get statistics
        DashboardStats stats = new DashboardStats(
                customerRepository.count(),
                assetRepository.count(),
                deploymentTaskRepository.countByStatus(TaskStatus.Scheduled),
                technicianRepository.count()
        );

        // Get recent audit logs (last 10)
        List<AuditLogDTO> recentLogs = auditLogRepository.findTop20ByOrderByTimestampDesc()
                .stream()
                .map(log -> new AuditLogDTO(
                        log.getLogId(),
                        log.getUser().getUsername(),
                        log.getActionType(),
                        log.getDescription(),
                        log.getTimestamp()
                ))
                .collect(Collectors.toList());

        // Get asset summary by type
        Map<String, Long> assetSummary = new HashMap<>();
        for (AssetType type : AssetType.values()) {
            assetSummary.put(
                    type.name().substring(0, 1).toLowerCase() +
                            type.name().substring(1).replaceAll("([A-Z])", "$1"),
                    assetRepository.countByAssetType(type)
            );
        }

        return new AdminDashboardResponse(stats, recentLogs, assetSummary);
    }
}
