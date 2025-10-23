package com.example.fiberflow_backup.service;

import com.example.fiberflow_backup.dto.LoginRequest;
import com.example.fiberflow_backup.dto.LoginResponse;
import com.example.fiberflow_backup.exception.InvalidCredentialException;
import com.example.fiberflow_backup.model.Asset;
import com.example.fiberflow_backup.model.Customer;
import com.example.fiberflow_backup.model.Task;
import com.example.fiberflow_backup.model.User;
import com.example.fiberflow_backup.repository.AssetRepository;
import com.example.fiberflow_backup.repository.CustomerRepository;
import com.example.fiberflow_backup.repository.TaskRepository;
import com.example.fiberflow_backup.repository.UserRepository;
import com.example.fiberflow_backup.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    @Autowired
    UserRepository userRepository;
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    JwtUtil jwtUtil;
    @Autowired
    CustomerRepository customerRepository;
    @Autowired
    AssetRepository assetRepository;
    @Autowired
    TaskRepository taskRepository;

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUsernameAndRole(request.getUsername(), request.getRole())
                .orElseThrow(() -> new RuntimeException("Invalid credentials or role"));

        if (!user.getActive()) {
            throw new RuntimeException("User account is deactivated");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());

        return new LoginResponse(
                user.getId(),
                user.getUsername(),
                user.getRole(),
                token,
                "Login successful"
        );
    }

    public void createDemoUsers() {
        if (userRepository.count() == 0) {
            String encodedPassword = passwordEncoder.encode("password123");

            userRepository.save(new User(null, "admin", encodedPassword, User.Role.Admin, true));
            userRepository.save(new User(null, "planner", encodedPassword, User.Role.Planner, true));
            userRepository.save(new User(null, "technician", encodedPassword, User.Role.Technician, true));
            userRepository.save(new User(null, "support", encodedPassword, User.Role.Support, true));
        }
    }
    public void createDemoData() {
        createDemoUsers();

        if (!userRepository.existsByUsername("tech-001")) {
            String encodedPassword = passwordEncoder.encode("password123");
            userRepository.save(new User(null, "tech-001", encodedPassword, User.Role.Technician, true));
            userRepository.save(new User(null, "tech-002", encodedPassword, User.Role.Technician, true));
            userRepository.save(new User(null, "tech-003", encodedPassword, User.Role.Technician, true));
        }

        if (customerRepository.count() == 0) {
            customerRepository.save(new Customer(null, "John Doe", "john@example.com",
                    "9876543210", "123 Main St, Bangalore", "Premium", LocalDateTime.now(),
                    Customer.Status.Active, LocalDateTime.now()));
            customerRepository.save(new Customer(null, "Jane Smith", "jane@example.com",
                    "9876543211", "456 Park Ave, Bangalore", "Basic", LocalDateTime.now(),
                    Customer.Status.Active, LocalDateTime.now()));
        }

        if (taskRepository.count() == 0) {
            User tech = userRepository.findByUsername("technician").orElse(null);
            Customer customer = customerRepository.findById(1L).orElse(null);

            if (tech != null && customer != null) {
                taskRepository.save(new Task(null, "Installation", customer, tech,
                        "Install fiber connection", Task.TaskStatus.Pending,
                        LocalDateTime.now().plusDays(2), LocalDateTime.now(), null));
            }
        }
        if (assetRepository.count() == 0) {
            // FDH Assets
            assetRepository.save(new Asset(null, "FDH-001", Asset.AssetType.FDH,
                    Asset.AssetStatus.Available, "Zone A - North", null, LocalDateTime.now()));
            assetRepository.save(new Asset(null, "FDH-002", Asset.AssetType.FDH,
                    Asset.AssetStatus.Assigned, "Zone B - South", LocalDateTime.now().minusDays(30), LocalDateTime.now()));
            assetRepository.save(new Asset(null, "FDH-003", Asset.AssetType.FDH,
                    Asset.AssetStatus.Available, "Zone C - East", null, LocalDateTime.now()));
            assetRepository.save(new Asset(null, "FDH-004", Asset.AssetType.FDH,
                    Asset.AssetStatus.Maintenance, "Zone D - West", LocalDateTime.now().minusDays(5), LocalDateTime.now()));

            // ONT Assets
            assetRepository.save(new Asset(null, "ONT-2024-001", Asset.AssetType.ONT,
                    Asset.AssetStatus.Available, "Warehouse", null, LocalDateTime.now()));
            assetRepository.save(new Asset(null, "ONT-2024-002", Asset.AssetType.ONT,
                    Asset.AssetStatus.Assigned, "Customer Site 1", null, LocalDateTime.now()));
            assetRepository.save(new Asset(null, "ONT-2024-003", Asset.AssetType.ONT,
                    Asset.AssetStatus.Available, "Warehouse", null, LocalDateTime.now()));
            assetRepository.save(new Asset(null, "ONT-2024-004", Asset.AssetType.ONT,
                    Asset.AssetStatus.Assigned, "Customer Site 2", null, LocalDateTime.now()));
            assetRepository.save(new Asset(null, "ONT-2024-005", Asset.AssetType.ONT,
                    Asset.AssetStatus.Defective, "Repair Center", null, LocalDateTime.now()));
            assetRepository.save(new Asset(null, "ONT-2024-006", Asset.AssetType.ONT,
                    Asset.AssetStatus.Available, "Warehouse", null, LocalDateTime.now()));

            // Router Assets
            assetRepository.save(new Asset(null, "RTR-2024-001", Asset.AssetType.Router,
                    Asset.AssetStatus.Available, "Warehouse", null, LocalDateTime.now()));
            assetRepository.save(new Asset(null, "RTR-2024-002", Asset.AssetType.Router,
                    Asset.AssetStatus.Assigned, "Customer Site 1", null, LocalDateTime.now()));
            assetRepository.save(new Asset(null, "RTR-2024-003", Asset.AssetType.Router,
                    Asset.AssetStatus.Available, "Warehouse", null, LocalDateTime.now()));
            assetRepository.save(new Asset(null, "RTR-2024-004", Asset.AssetType.Router,
                    Asset.AssetStatus.Available, "Warehouse", null, LocalDateTime.now()));
            assetRepository.save(new Asset(null, "RTR-2024-005", Asset.AssetType.Router,
                    Asset.AssetStatus.Maintenance, "Service Center", LocalDateTime.now().minusDays(10), LocalDateTime.now()));

            // Splitter Assets
            assetRepository.save(new Asset(null, "SPL-001", Asset.AssetType.Splitter,
                    Asset.AssetStatus.Available, "Zone A", null, LocalDateTime.now()));
            assetRepository.save(new Asset(null, "SPL-002", Asset.AssetType.Splitter,
                    Asset.AssetStatus.Assigned, "Zone B", null, LocalDateTime.now()));
            assetRepository.save(new Asset(null, "SPL-003", Asset.AssetType.Splitter,
                    Asset.AssetStatus.Assigned, "Zone C", null, LocalDateTime.now()));
            assetRepository.save(new Asset(null, "SPL-004", Asset.AssetType.Splitter,
                    Asset.AssetStatus.Available, "Warehouse", null, LocalDateTime.now()));

            // Cable Assets
            assetRepository.save(new Asset(null, "CBL-1000M-001", Asset.AssetType.Cable,
                    Asset.AssetStatus.Available, "Warehouse", null, LocalDateTime.now()));
            assetRepository.save(new Asset(null, "CBL-500M-001", Asset.AssetType.Cable,
                    Asset.AssetStatus.Available, "Warehouse", null, LocalDateTime.now()));
            assetRepository.save(new Asset(null, "CBL-1000M-002", Asset.AssetType.Cable,
                    Asset.AssetStatus.Assigned, "Deployment Van 1", null, LocalDateTime.now()));
            assetRepository.save(new Asset(null, "CBL-500M-002", Asset.AssetType.Cable,
                    Asset.AssetStatus.Assigned, "Deployment Van 2", null, LocalDateTime.now()));
            assetRepository.save(new Asset(null, "CBL-1000M-003", Asset.AssetType.Cable,
                    Asset.AssetStatus.Available, "Warehouse", null, LocalDateTime.now()));
        }
    }
}
