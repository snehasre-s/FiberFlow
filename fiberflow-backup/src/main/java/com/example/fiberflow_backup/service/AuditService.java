package com.example.fiberflow_backup.service;

import com.example.fiberflow_backup.dto.AuditFilterOptionsResponse;
import com.example.fiberflow_backup.dto.AuditLogDTO;

import java.util.List;

public interface AuditService {
    public List<AuditLogDTO> getAllAuditLogs();
    public AuditFilterOptionsResponse getFilterOptions();

}
