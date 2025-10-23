package com.example.fiberflow_backup.model;

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
    private Long id;

    @Column(nullable = false, unique = true)
    private String assetId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AssetType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AssetStatus status = AssetStatus.Available;

    private String location;

    @Column(name = "last_maintenance")
    private LocalDateTime lastMaintenance;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum AssetType {
        FDH, ONT, Router, Splitter, Cable
    }

    public enum AssetStatus {
        Available, Assigned, Defective, Maintenance
    }
}
