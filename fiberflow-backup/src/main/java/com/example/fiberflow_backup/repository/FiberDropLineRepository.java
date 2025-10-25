package com.example.fiberflow_backup.repository;

import com.example.fiberflow_backup.model.FiberDropLine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FiberDropLineRepository extends JpaRepository<FiberDropLine, Long> {
}
