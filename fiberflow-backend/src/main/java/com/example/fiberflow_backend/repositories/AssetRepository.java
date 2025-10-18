package com.example.fiberflow_backend.repositories;

import com.example.fiberflow_backend.entities.Asset;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssetRepository extends JpaRepository<Asset, Long> {
}
