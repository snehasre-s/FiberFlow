package com.example.fiberflow_backup.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "task_checklists")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskChecklist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "task_id", nullable = false)
    private DeploymentTask task;

    @Column(nullable = false)
    private String item;

    @Column(nullable = false)
    private Boolean completed = false;

    @Column(name = "display_order")
    private Integer displayOrder;
}
