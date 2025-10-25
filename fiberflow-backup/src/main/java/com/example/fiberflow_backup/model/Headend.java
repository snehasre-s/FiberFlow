package com.example.fiberflow_backup.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "headend")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Headend {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "headend_id")
    private Long headendId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 100)
    private String location;

    @Column(length = 100)
    private String region;
}