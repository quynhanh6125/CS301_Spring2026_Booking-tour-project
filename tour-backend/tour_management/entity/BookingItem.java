package com.tourbooking.tour_management.entity;

import com.tourbooking.tour_management.enums.ItemStatus;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "booking_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingItem {
    @Id
    private String id;

    @ManyToOne
    @JoinColumn(name = "booking_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties("items") // Thêm dòng này để không render ngược lại Booking
    private Booking booking;

    @ManyToOne
    @JoinColumn(name = "service_id", nullable = false)
    private Service service;

    @Column(name = "booked_date", nullable = false)
    private LocalDate bookedDate; // chỗ này customer sẽ chọn date trên frontend xong rồi hệ thống sẽ gán nó vào biến này

    @Column(name = "captured_name", nullable = false)
    private String capturedName;

    @Column(name = "start_time_snap", nullable = false)
    private LocalTime startTimeSnap;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "captured_price", nullable = false)
    private BigDecimal capturedPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    private ItemStatus status;
}