package com.example.fiberflow_backup.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskDetailsResponse {
    private List<ChecklistItem> checklist;
    private List<TaskNote> notes;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChecklistItem {
        private Long id;
        private String item;
        private Boolean completed;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TaskNote {
        private Long id;
        private String content;
        private String author;
        private String createdAt;
    }
}
