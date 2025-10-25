package com.example.fiberflow_backup.repository;

import com.example.fiberflow_backup.model.FDH;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FDHRepository extends JpaRepository<FDH, Long> {
}
