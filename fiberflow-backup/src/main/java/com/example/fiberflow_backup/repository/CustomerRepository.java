package com.example.fiberflow_backup.repository;

import com.example.fiberflow_backup.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    long countByStatus(Customer.Status status);
}
