package com.example.fiberflow_backup.dto;

import com.example.fiberflow_backup.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private Long userId;
    private String username;
    private UserRole role;
    private String token;
    private String message;
}
