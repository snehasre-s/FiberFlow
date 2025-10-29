package com.example.fiberflow_backup.serviceimpl;

import com.example.fiberflow_backup.dto.AuditFilterOptionsResponse;
import com.example.fiberflow_backup.dto.AuditLogDTO;
import com.example.fiberflow_backup.model.AuditLog;
import com.example.fiberflow_backup.repository.AuditLogRepository;
import com.example.fiberflow_backup.service.AuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuditServiceImpl implements AuditService {

    private final AuditLogRepository auditLogRepository;

    public List<AuditLogDTO> getAllAuditLogs() {
        return auditLogRepository.findAllByOrderByTimestampDesc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public AuditFilterOptionsResponse getFilterOptions() {
        List<AuditLog> allLogs = auditLogRepository.findAll();

        // Get distinct action types
        List<String> actionTypes = allLogs.stream()
                .map(AuditLog::getActionType)
                .distinct()
                .sorted()
                .collect(Collectors.toList());

        // Get distinct usernames
        List<String> users = allLogs.stream()
                .map(log -> log.getUser().getUsername())
                .distinct()
                .sorted()
                .collect(Collectors.toList());

        return new AuditFilterOptionsResponse(actionTypes, users);
    }

    private AuditLogDTO convertToDTO(AuditLog log) {
        return new AuditLogDTO(
                log.getLogId(),
                log.getUser().getUsername(),
                log.getActionType(),
                log.getDescription(),
                log.getTimestamp()
        );
    }
}
