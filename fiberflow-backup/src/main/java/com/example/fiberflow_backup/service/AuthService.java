package com.example.fiberflow_backup.service;

import com.example.fiberflow_backup.dto.LoginRequest;
import com.example.fiberflow_backup.dto.LoginResponse;
import com.example.fiberflow_backup.model.User;
import com.example.fiberflow_backup.repository.UserRepository;
import com.example.fiberflow_backup.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUsernameAndRole(request.getUsername(), request.getRole())
                .orElseThrow(() -> new RuntimeException("Invalid credentials or role"));

        if (!user.getActive()) {
            throw new RuntimeException("User account is deactivated");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
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

    // Method to create demo users (call this on startup or via separate endpoint)
    public void createDemoUsers() {
        if (userRepository.count() == 0) {
            String encodedPassword = passwordEncoder.encode("password123");

            userRepository.save(new User(null, "admin", encodedPassword, User.Role.Admin, true));
            userRepository.save(new User(null, "planner", encodedPassword, User.Role.Planner, true));
            userRepository.save(new User(null, "technician", encodedPassword, User.Role.Technician, true));
            userRepository.save(new User(null, "support", encodedPassword, User.Role.Support, true));
        }
    }
}
