package com.example.fiberflow_backup.repository;

import com.example.fiberflow_backup.model.UserLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserLogRepository extends JpaRepository<UserLog, Long> {
    List<UserLog> findTop10ByOrderByLoginTimeDesc();
}
