package com.example.fiberflow_backup.repository;

import com.example.fiberflow_backup.model.Headend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HeadendRepository extends JpaRepository<Headend, Long> {
}
