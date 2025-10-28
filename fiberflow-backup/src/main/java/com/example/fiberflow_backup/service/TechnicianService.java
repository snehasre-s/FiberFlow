package com.example.fiberflow_backup.service;

import com.example.fiberflow_backup.dto.TechnicianDashboardResponse;
import com.example.fiberflow_backup.dto.TechnicianDashboardResponse.TechnicianStats;
import com.example.fiberflow_backup.dto.TechnicianTaskDTO;
import com.example.fiberflow_backup.enums.TaskStatus;
import com.example.fiberflow_backup.model.DeploymentTask;
import com.example.fiberflow_backup.repository.DeploymentTaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TechnicianService {

    private final DeploymentTaskRepository deploymentTaskRepository;

    public TechnicianDashboardResponse getTechnicianDashboard() {
        // Get all tasks (in real app, filter by logged-in technician)
        List<DeploymentTask> allTasks = deploymentTaskRepository.findAll();

        // Calculate stats
        LocalDate today = LocalDate.now();
        LocalDateTime startOfWeek = LocalDate.now().minusDays(7).atStartOfDay();

        int pendingInstallations = (int) allTasks.stream()
                .filter(t -> t.getStatus() == TaskStatus.Scheduled || t.getStatus() == TaskStatus.InProgress)
                .count();

        int tasksDueToday = (int) allTasks.stream()
                .filter(t -> t.getScheduledDate() != null && t.getScheduledDate().equals(today))
                .filter(t -> t.getStatus() != TaskStatus.Completed)
                .count();

        int upcomingAppointments = (int) allTasks.stream()
                .filter(t -> t.getScheduledDate() != null && t.getScheduledDate().isAfter(today))
                .filter(t -> t.getStatus() == TaskStatus.Scheduled)
                .count();

        int completedThisWeek = (int) allTasks.stream()
                .filter(t -> t.getCompletedAt() != null && t.getCompletedAt().isAfter(startOfWeek))
                .count();

        TechnicianStats stats = new TechnicianStats(
                pendingInstallations,
                tasksDueToday,
                upcomingAppointments,
                completedThisWeek
        );

        // Convert tasks to DTOs
        List<TechnicianTaskDTO> tasks = allTasks.stream()
                .map(this::convertToTechnicianTaskDTO)
                .collect(Collectors.toList());

        return new TechnicianDashboardResponse(stats, tasks);
    }

    private TechnicianTaskDTO convertToTechnicianTaskDTO(DeploymentTask task) {
        return new TechnicianTaskDTO(
                task.getTaskId(),
                task.getTaskType(),
                task.getCustomer() != null ? task.getCustomer().getCustomerId() : null,
                task.getCustomer() != null ? task.getCustomer().getName() : "Unknown",
                task.getCustomer() != null ? task.getCustomer().getAddress() : "N/A",
                task.getTechnician() != null ? task.getTechnician().getName() : "Unassigned",
                task.getDescription(),
                task.getStatus().name(),
                task.getScheduledDate()
        );
    }
}
