package com.example.fiberflow_backup.repository;

import com.example.fiberflow_backup.model.SupportTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {
    List<SupportTicket> findTop20ByOrderByCreatedAtDesc();
    long countByStatus(String status);
    long countByResolvedAtAfter(LocalDateTime date);
}