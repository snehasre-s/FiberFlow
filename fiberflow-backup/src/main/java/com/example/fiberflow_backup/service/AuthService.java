package com.example.fiberflow_backup.service;

import com.example.fiberflow_backup.dto.LoginRequest;
import com.example.fiberflow_backup.dto.LoginResponse;

public interface AuthService {
    LoginResponse login(LoginRequest request);
    void updateLastLogin(Long userId);
}
