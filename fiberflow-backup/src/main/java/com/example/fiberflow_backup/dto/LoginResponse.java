package com.example.fiberflow_backup.dto;

import com.example.fiberflow_backup.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private Long id;
    private String username;
    private User.Role role;
    private String token;
    private String message;
}
