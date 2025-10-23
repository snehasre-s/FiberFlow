package com.example.fiberflow_backup.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "network_connections")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NetworkConnection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(name = "deployment_zone")
    private String deploymentZone;

    @Column(name = "fdh_location")
    private String fdhLocation;

    @Column(name = "splitter_port")
    private String splitterPort;

    @Column(name = "ont_serial")
    private String ontSerial;

    @Column(name = "router_serial")
    private String routerSerial;

    @Column(name = "cable_length")
    private String cableLength;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ConnectionStatus status = ConnectionStatus.Pending;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum ConnectionStatus {
        Pending, Active, Inactive, Suspended
    }
}
