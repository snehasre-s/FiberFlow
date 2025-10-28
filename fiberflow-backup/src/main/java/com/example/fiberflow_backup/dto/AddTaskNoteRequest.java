package com.example.fiberflow_backup.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddTaskNoteRequest {

    @NotBlank(message = "Note content is required")
    private String content;
}
