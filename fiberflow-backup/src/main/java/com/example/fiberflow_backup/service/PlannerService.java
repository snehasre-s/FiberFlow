package com.example.fiberflow_backup.service;

import com.example.fiberflow_backup.dto.PlannerDashboardResponse;
import com.example.fiberflow_backup.dto.PlannerDashboardResponse.*;
import com.example.fiberflow_backup.enums.CustomerStatus;
import com.example.fiberflow_backup.model.*;
import com.example.fiberflow_backup.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlannerService {

    private final FDHRepository fdhRepository;
    private final SplitterRepository splitterRepository;
    private final CustomerRepository customerRepository;
    private final AuditLogRepository auditLogRepository;

    public PlannerDashboardResponse getPlannerDashboard() {
        // Calculate network metrics
        NetworkMetrics metrics = calculateNetworkMetrics();

        // Get regional data
        List<RegionalData> regionalData = getRegionalData();

        // Get FDH capacity data
        List<FDHCapacityData> capacityData = getFDHCapacityData();

        // Get recent planning activities
        List<RecentActivity> activities = getRecentActivities();

        return new PlannerDashboardResponse(metrics, regionalData, capacityData, activities);
    }

    private NetworkMetrics calculateNetworkMetrics() {
        int totalFDH = (int) fdhRepository.count();
        int totalSplitters = (int) splitterRepository.count();

        List<Splitter> allSplitters = splitterRepository.findAll();
        int totalPorts = allSplitters.stream()
                .mapToInt(s -> s.getPortCapacity() != null ? s.getPortCapacity() : 0)
                .sum();
        int usedPorts = allSplitters.stream()
                .mapToInt(s -> s.getUsedPorts() != null ? s.getUsedPorts() : 0)
                .sum();

        int activeConnections = (int) customerRepository.countByStatus(CustomerStatus.Active);

        // For now, faults = 0 (implement fault tracking later)
        int faults = 0;

        return new NetworkMetrics(totalFDH, totalSplitters, totalPorts, usedPorts, activeConnections, faults);
    }

    private List<RegionalData> getRegionalData() {
        // Group customers by neighborhood (region)
        Map<String, Long> regionCounts = customerRepository.findAll().stream()
                .filter(c -> c.getNeighborhood() != null)
                .collect(Collectors.groupingBy(
                        Customer::getNeighborhood,
                        Collectors.counting()
                ));

        return regionCounts.entrySet().stream()
                .map(entry -> new RegionalData(entry.getKey(), entry.getValue().intValue()))
                .sorted((a, b) -> Integer.compare(b.getConnections(), a.getConnections()))
                .limit(5)
                .collect(Collectors.toList());
    }

    private List<FDHCapacityData> getFDHCapacityData() {
        return fdhRepository.findAll().stream()
                .map(fdh -> {
                    List<Splitter> fdHSplitters = splitterRepository.findByFdh_FdhId(fdh.getFdhId());

                    int splitterCount = fdHSplitters.size();
                    int totalCapacity = fdHSplitters.stream()
                            .mapToInt(s -> s.getPortCapacity() != null ? s.getPortCapacity() : 0)
                            .sum();
                    int usedPorts = fdHSplitters.stream()
                            .mapToInt(s -> s.getUsedPorts() != null ? s.getUsedPorts() : 0)
                            .sum();

                    return new FDHCapacityData(
                            fdh.getFdhId(),
                            fdh.getName(),
                            fdh.getRegion(),
                            splitterCount,
                            totalCapacity,
                            usedPorts
                    );
                })
                .collect(Collectors.toList());
    }

    private List<RecentActivity> getRecentActivities() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        return auditLogRepository.findTop20ByOrderByTimestampDesc().stream()
                .filter(log -> log.getActionType().contains("NETWORK") ||
                        log.getActionType().contains("FDH") ||
                        log.getActionType().contains("SPLITTER"))
                .limit(10)
                .map(log -> new RecentActivity(
                        log.getActionType(),
                        log.getDescription(),
                        log.getTimestamp().format(formatter)
                ))
                .collect(Collectors.toList());
    }
}
