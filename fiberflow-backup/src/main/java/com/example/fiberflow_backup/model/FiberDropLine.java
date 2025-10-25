package com.example.fiberflow_backup.model;

import com.example.fiberflow_backup.enums.LineStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "fiber_drop_line")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FiberDropLine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "line_id")
    private Long lineId;

    @ManyToOne
    @JoinColumn(name = "from_splitter_id")
    private Splitter fromSplitter;

    @ManyToOne
    @JoinColumn(name = "to_customer_id")
    private Customer toCustomer;

    @Column(name = "length_meters", precision = 6, scale = 2)
    private BigDecimal lengthMeters;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LineStatus status = LineStatus.Active;
}
