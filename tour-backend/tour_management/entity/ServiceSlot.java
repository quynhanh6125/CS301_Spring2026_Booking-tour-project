package com.tourbooking.tour_management.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalTime;
@Entity
@Table(name = "service_slots")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceSlot {
    @Id
    private String id;

    @ManyToOne
    @JoinColumn(name = "service_id", nullable = false)
    private Service service;

    @Column(name = "start_time", nullable = false)

    private LocalTime startTime;

    @Column(name = "max_capacity", nullable = false)
    private Integer maxCapacity;

    private Boolean active = true;
}