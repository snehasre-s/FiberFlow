package com.example.fiberflow_backup.repository;

import com.example.fiberflow_backup.model.TaskChecklist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskChecklistRepository extends JpaRepository<TaskChecklist, Long> {
    List<TaskChecklist> findByTask_TaskIdOrderByDisplayOrder(Long taskId);
    void deleteByTask_TaskId(Long taskId);
}
