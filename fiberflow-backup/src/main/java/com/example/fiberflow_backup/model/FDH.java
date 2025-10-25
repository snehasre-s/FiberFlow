package com.example.fiberflow_backup.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "fdh")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FDH {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fdh_id")
    private Long fdhId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 100)
    private String location;

    @Column(length = 100)
    private String region;

    @Column(name = "max_ports")
    private Integer maxPorts;

    @ManyToOne
    @JoinColumn(name = "headend_id")
    private Headend headend;
}
