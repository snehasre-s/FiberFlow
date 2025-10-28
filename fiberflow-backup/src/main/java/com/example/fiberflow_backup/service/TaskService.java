package com.example.fiberflow_backup.service;

import com.example.fiberflow_backup.dto.*;
import com.example.fiberflow_backup.dto.TaskDetailsResponse.ChecklistItem;
import com.example.fiberflow_backup.dto.TaskDetailsResponse.TaskNote;
import com.example.fiberflow_backup.enums.TaskStatus;
import com.example.fiberflow_backup.model.*;
import com.example.fiberflow_backup.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final DeploymentTaskRepository deploymentTaskRepository;
    private final TaskChecklistRepository taskChecklistRepository;
    private final TaskNoteRepository taskNoteRepository;
    private final TechnicianRepository technicianRepository;
    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    public List<TaskDTO> getAllTasks() {
        return deploymentTaskRepository.findAll().stream()
                .map(this::convertToTaskDTO)
                .collect(Collectors.toList());
    }

    public List<TechnicianSimpleDTO> getAllTechnicians() {
        return technicianRepository.findAll().stream()
                .map(tech -> new TechnicianSimpleDTO(
                        tech.getTechnicianId(),
                        tech.getName(),
                        tech.getContact(),
                        tech.getRegion()
                ))
                .collect(Collectors.toList());
    }

    public TaskDetailsResponse getTaskDetails(Long taskId) {
        // Get checklist
        List<ChecklistItem> checklist = taskChecklistRepository
                .findByTask_TaskIdOrderByDisplayOrder(taskId)
                .stream()
                .map(item -> new ChecklistItem(
                        item.getId(),
                        item.getItem(),
                        item.getCompleted()
                ))
                .collect(Collectors.toList());

        // Get notes
        List<TaskNote> notes = taskNoteRepository
                .findByTask_TaskIdOrderByCreatedAtDesc(taskId)
                .stream()
                .map(note -> new TaskNote(
                        note.getId(),
                        note.getContent(),
                        note.getAuthor(),
                        note.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
                ))
                .collect(Collectors.toList());

        // If no checklist exists, create default one
        if (checklist.isEmpty()) {
            checklist = createDefaultChecklist(taskId);
        }

        return new TaskDetailsResponse(checklist, notes);
    }

    @Transactional
    public void updateTaskStatus(Long taskId, String status) {
        DeploymentTask task = deploymentTaskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        TaskStatus newStatus = TaskStatus.valueOf(status);
        task.setStatus(newStatus);

        if (newStatus == TaskStatus.Completed) {
            task.setCompletedAt(LocalDateTime.now());
        }

        deploymentTaskRepository.save(task);

        // Log activity
        logActivity("TASK_STATUS_UPDATED",
                "Task #" + taskId + " status changed to: " + status);
    }

    @Transactional
    public void updateChecklist(Long taskId, UpdateChecklistRequest request) {
        DeploymentTask task = deploymentTaskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        // Delete existing checklist items
        taskChecklistRepository.deleteByTask_TaskId(taskId);

        // Create new checklist items
        int order = 1;
        for (UpdateChecklistRequest.ChecklistItemDTO itemDTO : request.getChecklist()) {
            TaskChecklist item = new TaskChecklist();
            item.setTask(task);
            item.setItem(itemDTO.getItem());
            item.setCompleted(itemDTO.getCompleted());
            item.setDisplayOrder(order++);
            taskChecklistRepository.save(item);
        }
    }

    @Transactional
    public TaskNote addNote(Long taskId, String content) {
        DeploymentTask task = deploymentTaskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        com.example.fiberflow_backup.model.TaskNote note = new com.example.fiberflow_backup.model.TaskNote();
        note.setTask(task);
        note.setContent(content);
        note.setAuthor("System User"); // In real app, get from authenticated user
        note.setCreatedAt(LocalDateTime.now());

        com.example.fiberflow_backup.model.TaskNote savedNote = taskNoteRepository.save(note);

        return new TaskNote(
                savedNote.getId(),
                savedNote.getContent(),
                savedNote.getAuthor(),
                savedNote.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
        );
    }

    private TaskDTO convertToTaskDTO(DeploymentTask task) {
        return new TaskDTO(
                task.getTaskId(),
                task.getTaskType(),
                task.getCustomer() != null ? task.getCustomer().getName() : "Unknown",
                task.getCustomer() != null ? task.getCustomer().getAddress() : "N/A",
                task.getTechnician() != null ? task.getTechnician().getName() : null,
                task.getDescription(),
                task.getStatus().name(),
                task.getScheduledDate()
        );
    }

    private List<ChecklistItem> createDefaultChecklist(Long taskId) {
        DeploymentTask task = deploymentTaskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        String[] defaultItems = {
                "Signal strength test",
                "ONT installation and configuration",
                "Router setup and testing",
                "Cable routing and management",
                "Connection speed verification",
                "Customer handover and training"
        };

        for (int i = 0; i < defaultItems.length; i++) {
            TaskChecklist item = new TaskChecklist();
            item.setTask(task);
            item.setItem(defaultItems[i]);
            item.setCompleted(false);
            item.setDisplayOrder(i + 1);
            taskChecklistRepository.save(item);
        }

        return taskChecklistRepository.findByTask_TaskIdOrderByDisplayOrder(taskId)
                .stream()
                .map(item -> new ChecklistItem(
                        item.getId(),
                        item.getItem(),
                        item.getCompleted()
                ))
                .collect(Collectors.toList());
    }

    private void logActivity(String actionType, String description) {
        try {
            User admin = userRepository.findByUsername("admin").orElse(null);
            if (admin != null) {
                AuditLog log = new AuditLog();
                log.setUser(admin);
                log.setActionType(actionType);
                log.setDescription(description);
                log.setTimestamp(LocalDateTime.now());
                auditLogRepository.save(log);
            }
        } catch (Exception e) {
            System.err.println("Failed to log activity: " + e.getMessage());
        }
    }
}
