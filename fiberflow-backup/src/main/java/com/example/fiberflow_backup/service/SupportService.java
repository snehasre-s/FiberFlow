package com.example.fiberflow_backup.service;

import com.example.fiberflow_backup.dto.*;
import com.example.fiberflow_backup.dto.SupportDashboardResponse.SupportMetrics;
import com.example.fiberflow_backup.dto.CustomerDetailDTO.*;
import com.example.fiberflow_backup.model.*;
import com.example.fiberflow_backup.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SupportService {

    private final CustomerRepository customerRepository;
    private final SupportTicketRepository supportTicketRepository;
    private final AssignedAssetsRepository assignedAssetsRepository;

    public SupportDashboardResponse getSupportDashboard() {
        // Calculate metrics
        SupportMetrics metrics = calculateSupportMetrics();

        // Get all customers
        List<CustomerSupportDTO> customers = customerRepository.findAll().stream()
                .map(this::convertToCustomerSupportDTO)
                .collect(Collectors.toList());

        // Get recent tickets
        List<SupportTicketDTO> recentTickets = supportTicketRepository
                .findTop20ByOrderByCreatedAtDesc().stream()
                .map(this::convertToSupportTicketDTO)
                .collect(Collectors.toList());

        return new SupportDashboardResponse(metrics, customers, recentTickets);
    }

    public CustomerDetailDTO getCustomerDetail(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // Get splitter info
        SplitterInfo splitterInfo = null;
        if (customer.getSplitter() != null) {
            Splitter splitter = customer.getSplitter();
            splitterInfo = new SplitterInfo(
                    splitter.getSplitterId(),
                    splitter.getModel(),
                    splitter.getLocation()
            );
        }

        // Get assigned assets
        List<AssetInfo> assignedAssets = assignedAssetsRepository
                .findByCustomer_CustomerId(customerId).stream()
                .map(aa -> new AssetInfo(
                        aa.getAsset().getAssetId(),
                        aa.getAsset().getAssetType().name(),
                        aa.getAsset().getSerialNumber(),
                        aa.getAsset().getModel()
                ))
                .collect(Collectors.toList());

        return new CustomerDetailDTO(
                customer.getCustomerId(),
                customer.getName(),
                customer.getAddress(),
                customer.getNeighborhood(),
                customer.getPlan(),
                customer.getConnectionType().name(),
                customer.getStatus().name(),
                customer.getAssignedPort(),
                customer.getCreatedAt(),
                splitterInfo,
                assignedAssets
        );
    }

    private SupportMetrics calculateSupportMetrics() {
        int openTickets = (int) supportTicketRepository.countByStatus("Open");

        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
        int resolvedToday = (int) supportTicketRepository.countByResolvedAtAfter(startOfToday);

        // Simple avg response time calculation (hours)
        int avgResponseTime = 4; // Placeholder - implement actual calculation

        int totalCustomers = (int) customerRepository.count();

        return new SupportMetrics(openTickets, resolvedToday, avgResponseTime, totalCustomers);
    }

    private CustomerSupportDTO convertToCustomerSupportDTO(Customer customer) {
        return new CustomerSupportDTO(
                customer.getCustomerId(),
                customer.getName(),
                customer.getNeighborhood(),
                customer.getPlan(),
                customer.getStatus().name()
        );
    }

    private SupportTicketDTO convertToSupportTicketDTO(SupportTicket ticket) {
        return new SupportTicketDTO(
                ticket.getTicketId(),
                ticket.getCustomer().getName(),
                ticket.getIssue(),
                ticket.getPriority(),
                ticket.getStatus(),
                ticket.getCreatedAt()
        );
    }
}
