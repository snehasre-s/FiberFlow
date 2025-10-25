package com.example.fiberflow_backup.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "splitter")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Splitter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "splitter_id")
    private Long splitterId;

    @ManyToOne
    @JoinColumn(name = "fdh_id")
    private FDH fdh;

    @Column(length = 50)
    private String model;

    @Column(name = "port_capacity")
    private Integer portCapacity;

    @Column(name = "used_ports")
    private Integer usedPorts = 0;

    @Column(length = 100)
    private String location;
}
