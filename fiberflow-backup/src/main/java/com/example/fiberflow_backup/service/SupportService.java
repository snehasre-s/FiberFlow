package com.example.fiberflow_backup.service;

import com.example.fiberflow_backup.dto.SupportDashboardResponse;
import com.example.fiberflow_backup.dto.CustomerDetailDTO;

public interface SupportService {
    SupportDashboardResponse getSupportDashboard();
    CustomerDetailDTO getCustomerDetail(Long customerId);
}
