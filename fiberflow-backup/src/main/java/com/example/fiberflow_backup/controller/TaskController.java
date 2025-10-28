package com.example.fiberflow_backup.controller;

import com.example.fiberflow_backup.dto.*;
import com.example.fiberflow_backup.dto.TaskDetailsResponse.TaskNote;
import com.example.fiberflow_backup.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Tasks", description = "Deployment task management APIs")
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    @Operation(summary = "Get all tasks", description = "Retrieve list of all deployment tasks")
    public ResponseEntity<List<TaskDTO>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @GetMapping("/technicians")
    @Operation(summary = "Get all technicians", description = "Retrieve list of all technicians")
    public ResponseEntity<List<TechnicianSimpleDTO>> getAllTechnicians() {
        return ResponseEntity.ok(taskService.getAllTechnicians());
    }

    @GetMapping("/{taskId}/details")
    @Operation(summary = "Get task details", description = "Get detailed information including checklist and notes")
    public ResponseEntity<?> getTaskDetails(@PathVariable Long taskId) {
        try {
            return ResponseEntity.ok(taskService.getTaskDetails(taskId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ErrorResponse(e.getMessage())
            );
        }
    }

    @PutMapping("/{taskId}/status")
    @Operation(summary = "Update task status", description = "Change the status of a deployment task")
    public ResponseEntity<?> updateTaskStatus(
            @PathVariable Long taskId,
            @Valid @RequestBody UpdateTaskStatusRequest request) {
        try {
            taskService.updateTaskStatus(taskId, request.getStatus());
            return ResponseEntity.ok(new SuccessResponse("Task status updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ErrorResponse(e.getMessage())
            );
        }
    }

    @PutMapping("/{taskId}/checklist")
    @Operation(summary = "Update task checklist", description = "Update checklist items for a task")
    public ResponseEntity<?> updateChecklist(
            @PathVariable Long taskId,
            @RequestBody UpdateChecklistRequest request) {
        try {
            taskService.updateChecklist(taskId, request);
            return ResponseEntity.ok(new SuccessResponse("Checklist updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ErrorResponse(e.getMessage())
            );
        }
    }

    @PostMapping("/{taskId}/notes")
    @Operation(summary = "Add task note", description = "Add a new note to a task")
    public ResponseEntity<?> addNote(
            @PathVariable Long taskId,
            @Valid @RequestBody AddTaskNoteRequest request) {
        try {
            TaskNote note = taskService.addNote(taskId, request.getContent());
            return ResponseEntity.ok(note);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ErrorResponse(e.getMessage())
            );
        }
    }

    record ErrorResponse(String message) {}
    record SuccessResponse(String message) {}
}
