package com.tourbooking.tour_management.entity;

import org.hibernate.type.SqlTypes;
import org.hibernate.annotations.JdbcTypeCode;
import com.tourbooking.tour_management.enums.ServiceCategory;
import com.tourbooking.tour_management.enums.ServiceType;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;


@Entity
@Table(name = "services")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Service {
    @Id
    private String id;

    @ManyToOne
    @JoinColumn(name = "provider_id", nullable = false)
    private User provider;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    @com.fasterxml.jackson.annotation.JsonBackReference // THÊM DÒNG NÀY: Chặn không cho con render ngược về cha
    private Service parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
    @com.fasterxml.jackson.annotation.JsonManagedReference // THÊM DÒNG NÀY: Cho phép cha render danh sách con
    private List<Service> subServices;

    @Column(nullable = false)
    private String name;

    @Column(name = "image_url")
    private String imageUrl;

    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(name = "duration",length = 100)
    private String duration;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(nullable = false)
    private ServiceCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    private ServiceType type;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @org.hibernate.annotations.CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private java.time.LocalDateTime createdAt;

}