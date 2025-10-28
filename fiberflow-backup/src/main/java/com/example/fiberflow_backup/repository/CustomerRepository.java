package com.example.fiberflow_backup.repository;

import com.example.fiberflow_backup.enums.CustomerStatus;
import com.example.fiberflow_backup.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    long countByStatus(CustomerStatus status);
    long countByCreatedAtAfter(LocalDateTime dateTime);
    List<Customer> findTop20ByOrderByCreatedAtDesc();
    List<Customer> findBySplitter_SplitterId(Long splitterId);  // ADD THIS
}