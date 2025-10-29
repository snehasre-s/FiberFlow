package com.example.fiberflow_backup.service;

import com.example.fiberflow_backup.dto.LoginRequest;
import com.example.fiberflow_backup.dto.LoginResponse;
import com.example.fiberflow_backup.enums.*;
import com.example.fiberflow_backup.exception.InvalidCredentialException;
import com.example.fiberflow_backup.model.*;
import com.example.fiberflow_backup.repository.*;
import com.example.fiberflow_backup.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final CustomerRepository customerRepository;
    private final AssetRepository assetRepository;
    private final DeploymentTaskRepository deploymentTaskRepository;
    private final TechnicianRepository technicianRepository;
    private final HeadendRepository headendRepository;
    private final FDHRepository fdhRepository;
    private final SplitterRepository splitterRepository;
    private final AuthenticationManager authenticationManager;
    private final AuditLogRepository auditLogRepository;
    private final SupportTicketRepository supportTicketRepository;


    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUsernameAndRole(request.getUsername(), request.getRole())
                .orElseThrow(() -> new RuntimeException("Invalid credentials or role"));

        if (!user.getActive()) {
            throw new RuntimeException("User account is deactivated");
        }
        String test = passwordEncoder.encode(request.getPassword());
        System.out.println();
        System.out.println(user.getPasswordHash() + " " + test);
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())){
            throw new InvalidCredentialException("Invalid Cred");
        }
//        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
//        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());

        return new LoginResponse(
                user.getUserId(),
                user.getUsername(),
                user.getRole(),
                token,
                "Login successful"
        );
    }

    @Transactional
    public void updateLastLogin(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
    }

    @Transactional
    public void initializeDemoData() {
        System.out.println(passwordEncoder.encode("admin123"));
        // Create demo users for all 6 roles
        // Create demo users for all 6 roles with unique passwords
        if (userRepository.count() == 0) {
            // Admin - password: admin123
            userRepository.save(createUser(null, "admin",
                    passwordEncoder.encode("admin123"), UserRole.Admin));

            // Planner - password: planner123
            userRepository.save(createUser(null, "planner",
                    passwordEncoder.encode("planner123"), UserRole.Planner));

            // Technician - password: tech123
            userRepository.save(createUser(null, "technician",
                    passwordEncoder.encode("tech123"), UserRole.Technician));

            // Support Agent - password: support123
            userRepository.save(createUser(null, "support",
                    passwordEncoder.encode("support123"), UserRole.SupportAgent));

            // Field Engineer - password: field123
            userRepository.save(createUser(null, "fieldengineer",
                    passwordEncoder.encode("field123"), UserRole.FieldEngineer));

            // Deployment Lead - password: deploy123
            userRepository.save(createUser(null, "deploymentlead",
                    passwordEncoder.encode("deploy123"), UserRole.DeploymentLead));
        }




        // Create demo technicians
        if (technicianRepository.count() == 0) {
            technicianRepository.save(new Technician(null, "John Smith", "9876543210", "North Bangalore"));
            technicianRepository.save(new Technician(null, "Sarah Johnson", "9876543211", "South Bangalore"));
            technicianRepository.save(new Technician(null, "Mike Williams", "9876543212", "East Bangalore"));
        }

        // Create network infrastructure
        if (headendRepository.count() == 0) {
            Headend headend = headendRepository.save(new Headend(null, "Main Headend", "Central Office", "Bangalore"));

            FDH fdh1 = fdhRepository.save(new FDH(null, "FDH-North-01", "North Zone", "North Bangalore", 144, headend));
            FDH fdh2 = fdhRepository.save(new FDH(null, "FDH-South-01", "South Zone", "South Bangalore", 144, headend));

            splitterRepository.save(new Splitter(null, fdh1, "1:8 Splitter", 8, 0, "North Zone Junction"));
            splitterRepository.save(new Splitter(null, fdh1, "1:16 Splitter", 16, 0, "North Zone Main"));
            splitterRepository.save(new Splitter(null, fdh2, "1:8 Splitter", 8, 0, "South Zone Junction"));
        }

        // Create demo customers
//        if (customerRepository.count() == 0) {
//            Splitter splitter = splitterRepository.findById(1L).orElse(null);
//
//            customerRepository.save(createCustomer(null, "John Doe", "123 Main Street, Bangalore",
//                    "Koramangala", "Premium 200 Mbps", ConnectionType.Wired, CustomerStatus.Active, splitter, 1));
//            customerRepository.save(createCustomer(null, "Jane Smith", "456 Park Avenue, Bangalore",
//                    "Indiranagar", "Standard 100 Mbps", ConnectionType.Wired, CustomerStatus.Active, splitter, 2));
//            customerRepository.save(createCustomer(null, "Robert Brown", "789 Tech Street, Bangalore",
//                    "Whitefield", "Basic 50 Mbps", ConnectionType.Wireless, CustomerStatus.Pending, null, null));
//        }
        // In initializeDemoData() method, update customer creation:

        if (customerRepository.count() == 0) {
            Splitter splitter1 = splitterRepository.findById(1L).orElse(null);
            Splitter splitter2 = splitterRepository.findById(2L).orElse(null);

            // Customer 1 - connected to splitter 1, port 1
            Customer customer1 = new Customer();
            customer1.setName("John Doe");
            customer1.setAddress("123 Main Street, Bangalore");
            customer1.setNeighborhood("Koramangala");
            customer1.setPlan("Premium 200 Mbps");
            customer1.setConnectionType(ConnectionType.Wired);
            customer1.setStatus(CustomerStatus.Active);
            customer1.setSplitter(splitter1);
            customer1.setAssignedPort(1);
            customer1.setCreatedAt(LocalDateTime.now());
            customerRepository.save(customer1);

            // Update splitter used ports
            if (splitter1 != null) {
                splitter1.setUsedPorts(splitter1.getUsedPorts() + 1);
                splitterRepository.save(splitter1);
            }

            // Customer 2 - connected to splitter 1, port 2
            Customer customer2 = new Customer();
            customer2.setName("Jane Smith");
            customer2.setAddress("456 Park Avenue, Bangalore");
            customer2.setNeighborhood("Indiranagar");
            customer2.setPlan("Standard 100 Mbps");
            customer2.setConnectionType(ConnectionType.Wired);
            customer2.setStatus(CustomerStatus.Active);
            customer2.setSplitter(splitter1);
            customer2.setAssignedPort(2);
            customer2.setCreatedAt(LocalDateTime.now());
            customerRepository.save(customer2);

            if (splitter1 != null) {
                splitter1.setUsedPorts(splitter1.getUsedPorts() + 1);
                splitterRepository.save(splitter1);
            }

            // Customer 3 - connected to splitter 2, port 1
            Customer customer3 = new Customer();
            customer3.setName("Robert Brown");
            customer3.setAddress("789 Tech Street, Bangalore");
            customer3.setNeighborhood("Whitefield");
            customer3.setPlan("Basic 50 Mbps");
            customer3.setConnectionType(ConnectionType.Wireless);
            customer3.setStatus(CustomerStatus.Pending);
            customer3.setSplitter(splitter2);
            customer3.setAssignedPort(1);
            customer3.setCreatedAt(LocalDateTime.now());
            customerRepository.save(customer3);

            if (splitter2 != null) {
                splitter2.setUsedPorts(splitter2.getUsedPorts() + 1);
                splitterRepository.save(splitter2);
            }
        }

        // Create demo assets
        if (assetRepository.count() == 0) {
            assetRepository.save(createAsset(null, AssetType.ONT, "ZTE F670L", "ONT-2024-001", AssetStatus.Available, "Warehouse", null, null));
            assetRepository.save(createAsset(null, AssetType.ONT, "ZTE F670L", "ONT-2024-002", AssetStatus.Assigned, "Customer Site", 1L, LocalDateTime.now()));
            assetRepository.save(createAsset(null, AssetType.Router, "TP-Link AC1750", "RTR-2024-001", AssetStatus.Available, "Warehouse", null, null));
            assetRepository.save(createAsset(null, AssetType.Router, "TP-Link AC1750", "RTR-2024-002", AssetStatus.Assigned, "Customer Site", 1L, LocalDateTime.now()));
            assetRepository.save(createAsset(null, AssetType.FiberRoll, "Single Mode 1000m", "FIBER-2024-001", AssetStatus.Available, "Warehouse", null, null));
            assetRepository.save(createAsset(null, AssetType.Switch, "Cisco SG350-10", "SW-2024-001", AssetStatus.Available, "Network Room", null, null));
            assetRepository.save(createAsset(null, AssetType.CPE, "Generic CPE", "CPE-2024-001", AssetStatus.Available, "Warehouse", null, null));
        }
        // Create demo deployment tasks
        if (deploymentTaskRepository.count() == 0) {
            Customer customer = customerRepository.findById(3L).orElse(null);
            Technician technician = technicianRepository.findById(1L).orElse(null);

            if (customer != null && technician != null) {
                // Task 1 - Scheduled
                DeploymentTask task1 = new DeploymentTask();
                task1.setCustomer(customer);
                task1.setTechnician(technician);
                task1.setTaskType("Installation");
                task1.setStatus(TaskStatus.Scheduled);
                task1.setScheduledDate(LocalDate.now().plusDays(2));
                task1.setDescription("Install fiber connection for new customer - Robert Brown");
                task1.setNotes(null);
                task1.setCompletedAt(null);
                deploymentTaskRepository.save(task1);

                // Task 2 - In Progress
                Customer customer2 = customerRepository.findById(1L).orElse(null);
                Technician technician2 = technicianRepository.findById(2L).orElse(null);

                if (customer2 != null && technician2 != null) {
                    DeploymentTask task2 = new DeploymentTask();
                    task2.setCustomer(customer2);
                    task2.setTechnician(technician2);
                    task2.setTaskType("Maintenance");
                    task2.setStatus(TaskStatus.InProgress);
                    task2.setScheduledDate(LocalDate.now());
                    task2.setDescription("Router configuration and speed test");
                    task2.setNotes("Customer reported slow speeds");
                    task2.setCompletedAt(null);
                    deploymentTaskRepository.save(task2);
                }

                // Task 3 - Completed
                Customer customer3 = customerRepository.findById(2L).orElse(null);

                if (customer3 != null && technician != null) {
                    DeploymentTask task3 = new DeploymentTask();
                    task3.setCustomer(customer3);
                    task3.setTechnician(technician);
                    task3.setTaskType("Installation");
                    task3.setStatus(TaskStatus.Completed);
                    task3.setScheduledDate(LocalDate.now().minusDays(5));
                    task3.setDescription("Complete fiber installation for Jane Smith");
                    task3.setNotes("Installation completed successfully. Customer satisfied.");
                    task3.setCompletedAt(LocalDateTime.now().minusDays(5));
                    deploymentTaskRepository.save(task3);
                }
            }
        }
// Create demo audit logs
        if (auditLogRepository.count() == 0) {
            User admin = userRepository.findByUsername("admin").orElse(null);
            User planner = userRepository.findByUsername("planner").orElse(null);

            if (admin != null) {
                auditLogRepository.save(new AuditLog(null, admin, "LOGIN",
                        "Admin user logged into the system", LocalDateTime.now().minusHours(2)));
                auditLogRepository.save(new AuditLog(null, admin, "CUSTOMER_CREATED",
                        "Created new customer: John Doe", LocalDateTime.now().minusHours(1)));
                auditLogRepository.save(new AuditLog(null, admin, "ASSET_ASSIGNED",
                        "Assigned ONT-2024-002 to customer", LocalDateTime.now().minusMinutes(30)));
            }

            if (planner != null) {
                auditLogRepository.save(new AuditLog(null, planner, "NETWORK_UPDATE",
                        "Updated network topology for North Zone", LocalDateTime.now().minusMinutes(15)));
                auditLogRepository.save(new AuditLog(null, planner, "FDH_CONFIGURED",
                        "Configured FDH-North-01", LocalDateTime.now().minusMinutes(5)));
            }
        }
        // Add this to initializeDemoData() method

// Create demo support tickets
        if (supportTicketRepository.count() == 0) {
            Customer customer1 = customerRepository.findById(1L).orElse(null);
            Customer customer2 = customerRepository.findById(2L).orElse(null);
            Customer customer3 = customerRepository.findById(3L).orElse(null);

            if (customer1 != null) {
                SupportTicket ticket1 = new SupportTicket();
                ticket1.setCustomer(customer1);
                ticket1.setIssue("Slow internet speed - getting 50 Mbps instead of 200 Mbps");
                ticket1.setPriority("High");
                ticket1.setStatus("Open");
                ticket1.setCreatedAt(LocalDateTime.now().minusHours(2));
                ticket1.setAssignedTo("Support Agent");
                supportTicketRepository.save(ticket1);
            }

            if (customer2 != null) {
                SupportTicket ticket2 = new SupportTicket();
                ticket2.setCustomer(customer2);
                ticket2.setIssue("WiFi router not working properly");
                ticket2.setPriority("Medium");
                ticket2.setStatus("InProgress");
                ticket2.setCreatedAt(LocalDateTime.now().minusHours(5));
                ticket2.setAssignedTo("Support Agent");
                supportTicketRepository.save(ticket2);
            }

            if (customer3 != null) {
                SupportTicket ticket3 = new SupportTicket();
                ticket3.setCustomer(customer3);
                ticket3.setIssue("Billing inquiry - double charge this month");
                ticket3.setPriority("Low");
                ticket3.setStatus("Resolved");
                ticket3.setCreatedAt(LocalDateTime.now().minusDays(1));
                ticket3.setResolvedAt(LocalDateTime.now().minusHours(3));
                ticket3.setAssignedTo("Support Agent");
                supportTicketRepository.save(ticket3);
            }

            System.out.println("✅ Demo support tickets created");


        }
    }

    private User createUser(Long id, String username, String passwordHash, UserRole role) {
        User user = new User();
        user.setUserId(id);
        user.setUsername(username);
        user.setPasswordHash(passwordHash);
        user.setRole(role);
        user.setActive(true);
        user.setLastLogin(null);
        return user;
    }

    private Customer createCustomer(Long id, String name, String address, String neighborhood,
                                    String plan, ConnectionType connectionType, CustomerStatus status,
                                    Splitter splitter, Integer port) {
        Customer customer = new Customer();
        customer.setCustomerId(id);
        customer.setName(name);
        customer.setAddress(address);
        customer.setNeighborhood(neighborhood);
        customer.setPlan(plan);
        customer.setConnectionType(connectionType);
        customer.setStatus(status);
        customer.setSplitter(splitter);
        customer.setAssignedPort(port);
        customer.setCreatedAt(LocalDateTime.now());
        return customer;
    }

    private Asset createAsset(Long id, AssetType type, String model, String serialNumber,
                              AssetStatus status, String location, Long customerId, LocalDateTime assignedDate) {
        Asset asset = new Asset();
        asset.setAssetId(id);
        asset.setAssetType(type);
        asset.setModel(model);
        asset.setSerialNumber(serialNumber);
        asset.setStatus(status);
        asset.setLocation(location);
        asset.setAssignedToCustomerId(customerId);
        asset.setAssignedDate(assignedDate);
        return asset;
    }
}
