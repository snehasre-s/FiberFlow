package com.example.fiberflow_backup.service;

import com.example.fiberflow_backup.dto.*;
import com.example.fiberflow_backup.dto.TaskDetailsResponse.TaskNote;

import java.util.List;

public interface TaskService {
    List<TaskDTO> getAllTasks();
    List<TechnicianSimpleDTO> getAllTechnicians();
    TaskDetailsResponse getTaskDetails(Long taskId);
    void updateTaskStatus(Long taskId, String status);
    void updateChecklist(Long taskId, UpdateChecklistRequest request);
    TaskNote addNote(Long taskId, String content);
}
