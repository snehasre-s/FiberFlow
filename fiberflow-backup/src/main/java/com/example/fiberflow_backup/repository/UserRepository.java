package com.example.fiberflow_backup.repository;

import com.example.fiberflow_backup.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsernameAndRole(String username, User.Role role);
    Optional<User> findByUsername(String username);
    Boolean existsByUsername(String username);
}
