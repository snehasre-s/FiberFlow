package com.example.fiberflow_backup.repository;

import com.example.fiberflow_backup.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    long countByStatus(Task.TaskStatus status);
}
