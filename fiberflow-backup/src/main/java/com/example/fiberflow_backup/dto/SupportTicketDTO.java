package com.example.fiberflow_backup.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupportTicketDTO {
    private Long ticketId;
    private String customerName;
    private String issue;
    private String priority;
    private String status;
    private LocalDateTime createdAt;
}
