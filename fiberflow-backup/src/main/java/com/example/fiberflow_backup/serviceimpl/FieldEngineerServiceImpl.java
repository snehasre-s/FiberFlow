package com.example.fiberflow_backup.serviceimpl;

import com.example.fiberflow_backup.dto.*;
import com.example.fiberflow_backup.dto.FieldEngineerDashboardResponse.FieldEngineerStats;
import com.example.fiberflow_backup.enums.ConnectionType;
import com.example.fiberflow_backup.enums.CustomerStatus;
import com.example.fiberflow_backup.model.AuditLog;
import com.example.fiberflow_backup.model.Customer;
import com.example.fiberflow_backup.model.User;
import com.example.fiberflow_backup.repository.AuditLogRepository;
import com.example.fiberflow_backup.repository.CustomerRepository;
import com.example.fiberflow_backup.repository.UserRepository;
import com.example.fiberflow_backup.service.FieldEngineerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FieldEngineerServiceImpl implements FieldEngineerService {

    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;

    public FieldEngineerDashboardResponse getDashboardData() {
        // Calculate stats
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime startOfWeek = LocalDate.now().minusDays(7).atStartOfDay();

        long todayCreated = customerRepository.countByCreatedAtAfter(startOfDay);
        long weekCreated = customerRepository.countByCreatedAtAfter(startOfWeek);
        long pendingActivation = customerRepository.countByStatus(CustomerStatus.Pending);

        FieldEngineerStats stats = new FieldEngineerStats(todayCreated, weekCreated, pendingActivation);

        // Get recent customers (last 20)
        List<CustomerDTO> recentCustomers = customerRepository
                .findTop20ByOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return new FieldEngineerDashboardResponse(stats, recentCustomers);
    }

    @Transactional
    public CreateCustomerResponse createCustomer(CreateCustomerRequest request) {
        // Create customer
        Customer customer = new Customer();
        customer.setName(request.getName());
        customer.setAddress(request.getAddress());
        customer.setNeighborhood(request.getNeighborhood());
        customer.setPlan(request.getPlan());
        customer.setConnectionType(ConnectionType.valueOf(request.getConnectionType()));
        customer.setStatus(CustomerStatus.Pending);
        customer.setSplitter(null); // Will be assigned later
        customer.setAssignedPort(null);
        customer.setCreatedAt(LocalDateTime.now());

        Customer savedCustomer = customerRepository.save(customer);

        // Create audit log
        logActivity("CUSTOMER_CREATED",
                "Created new customer: " + savedCustomer.getName() +
                        " | Plan: " + savedCustomer.getPlan());

        return new CreateCustomerResponse(
                savedCustomer.getCustomerId(),
                savedCustomer.getName(),
                savedCustomer.getStatus().name(),
                "Customer created successfully. Deployment task will be generated."
        );
    }

    private CustomerDTO convertToDTO(Customer customer) {
        return new CustomerDTO(
                customer.getCustomerId(),
                customer.getName(),
                customer.getNeighborhood(),
                customer.getPlan(),
                customer.getConnectionType().name(),
                customer.getStatus().name(),
                customer.getCreatedAt()
        );
    }

    private void logActivity(String actionType, String description) {
        try {
            User fieldEngineer = userRepository.findByUsername("fieldengineer").orElse(null);
            if (fieldEngineer != null) {
                AuditLog log = new AuditLog();
                log.setUser(fieldEngineer);
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
