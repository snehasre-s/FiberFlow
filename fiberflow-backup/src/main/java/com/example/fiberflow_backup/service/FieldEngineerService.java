package com.example.fiberflow_backup.service;

import com.example.fiberflow_backup.dto.FieldEngineerDashboardResponse;
import com.example.fiberflow_backup.dto.CreateCustomerRequest;
import com.example.fiberflow_backup.dto.CreateCustomerResponse;

public interface FieldEngineerService {
    FieldEngineerDashboardResponse getDashboardData();
    CreateCustomerResponse createCustomer(CreateCustomerRequest request);
}
