package com.example.fiberflow_backup.controller;

import com.example.fiberflow_backup.dto.LoginRequest;
import com.example.fiberflow_backup.dto.LoginResponse;
import com.example.fiberflow_backup.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ErrorResponse(e.getMessage())
            );
        }
    }

    @PostMapping("/init-demo-users")
    public ResponseEntity<String> initDemoUsers() {
        authService.createDemoUsers();
        return ResponseEntity.ok("Demo users created successfully");
    }

    record ErrorResponse(String message) {}
}
