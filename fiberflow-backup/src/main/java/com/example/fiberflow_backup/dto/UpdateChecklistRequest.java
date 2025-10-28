package com.example.fiberflow_backup.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateChecklistRequest {
    private List<ChecklistItemDTO> checklist;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChecklistItemDTO {
        private Long id;
        private String item;
        private Boolean completed;
    }
}
