package com.example.fiberflow_backup.repository;

import com.example.fiberflow_backup.model.NetworkConnection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface NetworkConnectionRepository extends JpaRepository<NetworkConnection, Long> {
    Optional<NetworkConnection> findByCustomerId(Long customerId);
}
