package com.example.fiberflow_backup.model;

import com.example.fiberflow_backup.enums.AssetStatus;
import com.example.fiberflow_backup.enums.AssetType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "assets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "asset_id")
    private Long assetId;

    @Enumerated(EnumType.STRING)
    @Column(name = "asset_type", nullable = false)
    private AssetType assetType;

    @Column(length = 100)
    private String model;

    @Column(name = "serial_number", unique = true, length = 100)
    private String serialNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AssetStatus status = AssetStatus.Available;

    @Column(length = 100)
    private String location;

    @Column(name = "assigned_to_customer_id")
    private Long assignedToCustomerId;

    @Column(name = "assigned_date")
    private LocalDateTime assignedDate;
}