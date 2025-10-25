package com.example.fiberflow_backup.service;

import com.example.fiberflow_backup.dto.LoginRequest;
import com.example.fiberflow_backup.dto.LoginResponse;
import com.example.fiberflow_backup.enums.*;
import com.example.fiberflow_backup.model.*;
import com.example.fiberflow_backup.repository.*;
import com.example.fiberflow_backup.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    @Autowired
    AuditLogRepository auditLogRepository;

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUsernameAndRole(request.getUsername(), request.getRole())
                .orElseThrow(() -> new RuntimeException("Invalid credentials or role"));

        if (!user.getActive()) {
            throw new RuntimeException("User account is deactivated");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

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
        // Create demo users for all 6 roles
        if (userRepository.count() == 0) {
            String encodedPassword = passwordEncoder.encode("password123");

            userRepository.save(createUser(null, "admin", encodedPassword, UserRole.Admin));
            userRepository.save(createUser(null, "planner", encodedPassword, UserRole.Planner));
            userRepository.save(createUser(null, "technician", encodedPassword, UserRole.Technician));
            userRepository.save(createUser(null, "support", encodedPassword, UserRole.SupportAgent));
            userRepository.save(createUser(null, "fieldengineer", encodedPassword, UserRole.FieldEngineer));
            userRepository.save(createUser(null, "deploymentlead", encodedPassword, UserRole.DeploymentLead));
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
        if (customerRepository.count() == 0) {
            Splitter splitter = splitterRepository.findById(1L).orElse(null);

            customerRepository.save(createCustomer(null, "John Doe", "123 Main Street, Bangalore",
                    "Koramangala", "Premium 200 Mbps", ConnectionType.Wired, CustomerStatus.Active, splitter, 1));
            customerRepository.save(createCustomer(null, "Jane Smith", "456 Park Avenue, Bangalore",
                    "Indiranagar", "Standard 100 Mbps", ConnectionType.Wired, CustomerStatus.Active, splitter, 2));
            customerRepository.save(createCustomer(null, "Robert Brown", "789 Tech Street, Bangalore",
                    "Whitefield", "Basic 50 Mbps", ConnectionType.Wireless, CustomerStatus.Pending, null, null));
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
                deploymentTaskRepository.save(new DeploymentTask(null, customer, technician,
                        TaskStatus.Scheduled, java.time.LocalDate.now().plusDays(2),
                        "Install fiber connection for new customer"));
            }
        }
        // Add this at the end of initializeDemoData() method in AuthService.java

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
