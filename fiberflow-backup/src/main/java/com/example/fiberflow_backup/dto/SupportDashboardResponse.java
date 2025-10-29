package com.example.fiberflow_backup.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupportDashboardResponse {
    private SupportMetrics metrics;
    private List<CustomerSupportDTO> customers;
    private List<SupportTicketDTO> recentTickets;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SupportMetrics {
        private int openTickets;
        private int resolvedToday;
        private int avgResponseTime;
        private int totalCustomers;
    }
}
