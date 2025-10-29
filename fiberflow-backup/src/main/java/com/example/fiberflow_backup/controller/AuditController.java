package com.example.fiberflow_backup.controller;

import com.example.fiberflow_backup.dto.AuditFilterOptionsResponse;
import com.example.fiberflow_backup.dto.AuditLogDTO;
import com.example.fiberflow_backup.serviceimpl.AuditServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Audit", description = "Audit log and activity tracking APIs")
public class AuditController {

    private final AuditServiceImpl auditServiceImpl;

    @GetMapping("/logs")
    @Operation(summary = "Get all audit logs", description = "Retrieve complete audit trail of system activities")
    public ResponseEntity<List<AuditLogDTO>> getAllAuditLogs() {
        List<AuditLogDTO> logs = auditServiceImpl.getAllAuditLogs();
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/filter-options")
    @Operation(summary = "Get filter options", description = "Retrieve available action types and users for filtering")
    public ResponseEntity<AuditFilterOptionsResponse> getFilterOptions() {
        AuditFilterOptionsResponse options = auditServiceImpl.getFilterOptions();
        return ResponseEntity.ok(options);
    }
}
