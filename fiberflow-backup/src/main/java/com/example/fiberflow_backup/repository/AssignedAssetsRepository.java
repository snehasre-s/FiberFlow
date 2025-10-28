package com.example.fiberflow_backup.repository;

import com.example.fiberflow_backup.model.AssignedAssets;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignedAssetsRepository extends JpaRepository<AssignedAssets, Long> {
    List<AssignedAssets> findByCustomer_CustomerId(Long customerId);
    void deleteByCustomerCustomerIdAndAssetAssetId(Long customerId, Long assetId);  // ADD THIS
}
