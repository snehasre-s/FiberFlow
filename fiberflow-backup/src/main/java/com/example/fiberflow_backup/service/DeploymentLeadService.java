package com.example.fiberflow_backup.service;

import com.example.fiberflow_backup.dto.*;
import com.example.fiberflow_backup.dto.DeploymentLeadDashboardResponse.DeploymentLeadStats;
import com.example.fiberflow_backup.enums.AssetStatus;
import com.example.fiberflow_backup.enums.AssetType;
import com.example.fiberflow_backup.enums.CustomerStatus;
import com.example.fiberflow_backup.model.*;
import com.example.fiberflow_backup.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DeploymentLeadService {

    private final CustomerRepository customerRepository;
    private final AssetRepository assetRepository;
    private final AssignedAssetsRepository assignedAssetsRepository;
    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    public DeploymentLeadDashboardResponse getDashboardData() {
        // Calculate stats
        long totalCustomers = customerRepository.count();
        long assetsAllocated = assetRepository.countByStatus(AssetStatus.Assigned);
        long availableAssets = assetRepository.countByStatus(AssetStatus.Available);
        long pendingAllocations = customerRepository.countByStatus(CustomerStatus.Pending);

        DeploymentLeadStats stats = new DeploymentLeadStats(
                totalCustomers,
                assetsAllocated,
                availableAssets,
                pendingAllocations
        );

        // Get all customers with their allocated assets
        List<CustomerWithAssetsDTO> customers = customerRepository.findAll()
                .stream()
                .map(this::convertToCustomerWithAssetsDTO)
                .collect(Collectors.toList());

        return new DeploymentLeadDashboardResponse(stats, customers);
    }

    public List<AvailableAssetDTO> getAvailableAssets(String assetType) {
        AssetType type = AssetType.valueOf(assetType);

        return assetRepository.findByAssetTypeAndStatus(type, AssetStatus.Available)
                .stream()
                .map(asset -> new AvailableAssetDTO(
                        asset.getAssetId(),
                        asset.getSerialNumber(),
                        asset.getModel(),
                        asset.getLocation()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public void allocateAsset(AllocateAssetRequest request) {
        // Get customer
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // Get asset
        Asset asset = assetRepository.findById(request.getAssetId())
                .orElseThrow(() -> new RuntimeException("Asset not found"));

        // Check if asset is available
        if (asset.getStatus() != AssetStatus.Available) {
            throw new RuntimeException("Asset is not available for allocation");
        }

        // Update asset status
        asset.setStatus(AssetStatus.Assigned);
        asset.setAssignedToCustomerId(customer.getCustomerId());
        asset.setAssignedDate(LocalDateTime.now());
        assetRepository.save(asset);

        // Create assigned asset record
        AssignedAssets assignedAsset = new AssignedAssets();
        assignedAsset.setCustomer(customer);
        assignedAsset.setAsset(asset);
        assignedAsset.setAssignedOn(LocalDateTime.now());
        assignedAssetsRepository.save(assignedAsset);

        // Log activity
        logActivity("ASSET_ALLOCATED",
                "Allocated " + asset.getAssetType() + " (" + asset.getSerialNumber() +
                        ") to customer: " + customer.getName());
    }

    @Transactional
    public void deallocateAsset(DeallocateAssetRequest request) {
        // Get customer
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // Get asset
        Asset asset = assetRepository.findById(request.getAssetId())
                .orElseThrow(() -> new RuntimeException("Asset not found"));

        // Check if asset is assigned to this customer
        if (asset.getAssignedToCustomerId() == null ||
                !asset.getAssignedToCustomerId().equals(customer.getCustomerId())) {
            throw new RuntimeException("Asset is not assigned to this customer");
        }

        // Update asset status
        asset.setStatus(AssetStatus.Available);
        asset.setAssignedToCustomerId(null);
        asset.setAssignedDate(null);
        assetRepository.save(asset);

        // Remove assigned asset record
        assignedAssetsRepository.deleteByCustomerCustomerIdAndAssetAssetId(
                customer.getCustomerId(),
                asset.getAssetId()
        );

        // Log activity
        logActivity("ASSET_DEALLOCATED",
                "Deallocated " + asset.getAssetType() + " (" + asset.getSerialNumber() +
                        ") from customer: " + customer.getName());
    }

    private CustomerWithAssetsDTO convertToCustomerWithAssetsDTO(Customer customer) {
        // Get allocated assets for this customer
        List<AllocatedAssetDTO> allocatedAssets = assignedAssetsRepository
                .findByCustomer_CustomerId(customer.getCustomerId())
                .stream()
                .map(aa -> new AllocatedAssetDTO(
                        aa.getAsset().getAssetId(),
                        aa.getAsset().getAssetType().name(),
                        aa.getAsset().getSerialNumber(),
                        aa.getAsset().getModel()
                ))
                .collect(Collectors.toList());

        return new CustomerWithAssetsDTO(
                customer.getCustomerId(),
                customer.getName(),
                customer.getNeighborhood(),
                customer.getPlan(),
                customer.getStatus().name(),
                allocatedAssets
        );
    }

    private void logActivity(String actionType, String description) {
        try {
            User deploymentLead = userRepository.findByUsername("deploymentlead").orElse(null);
            if (deploymentLead != null) {
                AuditLog log = new AuditLog();
                log.setUser(deploymentLead);
                log.setActionType(actionType);
                log.setDescription(description);
                log.setTimestamp(LocalDateTime.now());
                auditLogRepository.save(log);
            }
        } catch (Exception e) {
            System.err.println("Failed to log activity: " + e.getMessage());
        }
    }
}
