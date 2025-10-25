package com.example.fiberflow_backup.repository;

import com.example.fiberflow_backup.model.Splitter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SplitterRepository extends JpaRepository<Splitter, Long> {
}
