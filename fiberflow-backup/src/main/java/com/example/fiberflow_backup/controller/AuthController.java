package com.example.fiberflow_backup.controller;

import com.example.fiberflow_backup.dto.LoginRequest;
import com.example.fiberflow_backup.dto.LoginResponse;
import com.example.fiberflow_backup.dto.UpdateLastLoginRequest;
import com.example.fiberflow_backup.serviceimpl.AuthServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Authentication", description = "User authentication and login APIs")
public class AuthController {

    private final AuthServiceImpl authServiceImpl;

    @PostMapping("/login")
    @Operation(summary = "Auto login", description = "Login without role selection - role is detected automatically")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            LoginResponse response = authServiceImpl.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ErrorResponse(e.getMessage())
            );
        }
    }

    @PostMapping("/update-last-login")
    @Operation(summary = "Update last login", description = "Update user's last login timestamp")
    public ResponseEntity<?> updateLastLogin(@RequestBody UpdateLastLoginRequest request) {
        try {
            authServiceImpl.updateLastLogin(request.getUserId());
            return ResponseEntity.ok(new SuccessResponse("Last login updated"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ErrorResponse(e.getMessage())
            );
        }
    }


    record ErrorResponse(String message) {}
    record SuccessResponse(String message) {}
}
