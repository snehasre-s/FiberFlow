package com.example.fiberflow_backup.model;

import com.example.fiberflow_backup.enums.ConnectionType;
import com.example.fiberflow_backup.enums.CustomerStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "customers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id")
    private Long customerId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(length = 100)
    private String neighborhood;

    @Column(length = 50)
    private String plan;

    @Enumerated(EnumType.STRING)
    @Column(name = "connection_type")
    private ConnectionType connectionType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CustomerStatus status = CustomerStatus.Pending;

    @ManyToOne
    @JoinColumn(name = "splitter_id")
    private Splitter splitter;

    @Column(name = "assigned_port")
    private Integer assignedPort;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
