package com.example.fiberflow_backup.service;

import com.example.fiberflow_backup.dto.CustomerOnboardingRequest;
import com.example.fiberflow_backup.dto.CustomerOnboardingResponse;
import com.example.fiberflow_backup.model.*;
import com.example.fiberflow_backup.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final NetworkConnectionRepository networkConnectionRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ActivityLogRepository activityLogRepository;
    @Transactional
    public CustomerOnboardingResponse onboardCustomer(CustomerOnboardingRequest request) {

        // Step 1: Create Customer
        Customer customer = new Customer();
        customer.setName(request.getName());
        customer.setEmail(request.getEmail());
        customer.setPhone(request.getPhone());
        customer.setAddress(request.getAddress() + ", " + request.getCity() + ", " +
                request.getState() + " - " + request.getPincode());
        customer.setServicePlan(request.getServicePlan());
        customer.setStatus(Customer.Status.Pending);
        customer.setActivationDate(null); // Will be set after installation
        customer.setCreatedAt(LocalDateTime.now());

        Customer savedCustomer = customerRepository.save(customer);

        // Step 2: Create Network Connection
        NetworkConnection connection = new NetworkConnection();
        connection.setCustomer(savedCustomer);
        connection.setDeploymentZone(request.getDeploymentZone());
        connection.setFdhLocation(request.getFdhLocation());
        connection.setSplitterPort(request.getSplitterPort());
        connection.setOntSerial(request.getOntSerialNumber());
        connection.setRouterSerial(request.getRouterSerialNumber());
        connection.setCableLength(request.getCableLength());
        connection.setStatus(NetworkConnection.ConnectionStatus.Pending);
        connection.setCreatedAt(LocalDateTime.now());

        networkConnectionRepository.save(connection);

        // Step 3: Create Installation Task
        User technician = userRepository.findByUsername(request.getTechnician())
                .orElse(userRepository.findByUsername("technician").orElse(null));

        Task installationTask = new Task();
        installationTask.setTaskType("Installation");
        installationTask.setCustomer(savedCustomer);
        installationTask.setAssignedTo(technician);
        installationTask.setDescription("Install fiber connection for " + savedCustomer.getName() +
                ". " + (request.getNotes() != null ? request.getNotes() : ""));
        installationTask.setStatus(Task.TaskStatus.Pending);
        installationTask.setDueDate(LocalDateTime.parse(request.getInstallationDate() + "T10:00:00"));
        installationTask.setCreatedAt(LocalDateTime.now());

        Task savedTask = taskRepository.save(installationTask);

        // Step 4: Log Activity
        User admin = userRepository.findByUsername("admin").orElse(null);
        if (admin != null) {
            ActivityLog log = new ActivityLog();
            log.setUser(admin);
            log.setAction("Customer Onboarded");
            log.setDetails("Onboarded customer: " + savedCustomer.getName() +
                    " | Service Plan: " + savedCustomer.getServicePlan());
            log.setStatus(ActivityLog.LogStatus.Success);
            log.setTimestamp(LocalDateTime.now());
            activityLogRepository.save(log);
        }

        // Step 5: Generate Customer ID
        String customerId = "CUST-" + String.format("%06d", savedCustomer.getId());

        return new CustomerOnboardingResponse(
                savedCustomer.getId(),
                customerId,
                savedCustomer.getName(),
                savedCustomer.getEmail(),
                savedCustomer.getStatus().name(),
                savedTask.getId(),
                "Customer onboarded successfully. Installation task created."
        );
    }

    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
    }
}
