package com.example.fiberflow_backup.repository;

import com.example.fiberflow_backup.model.TaskNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskNoteRepository extends JpaRepository<TaskNote, Long> {
    List<TaskNote> findByTask_TaskIdOrderByCreatedAtDesc(Long taskId);
}
