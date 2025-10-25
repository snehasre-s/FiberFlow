package com.example.fiberflow_backup.repository;

import com.example.fiberflow_backup.enums.TaskStatus;
import com.example.fiberflow_backup.model.DeploymentTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeploymentTaskRepository extends JpaRepository<DeploymentTask, Long> {
    long countByStatus(TaskStatus status);
}
