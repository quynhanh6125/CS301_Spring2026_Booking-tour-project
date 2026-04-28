package com.tourbooking.tour_management.repository;

import com.tourbooking.tour_management.dto.SlotAvailabilityDTO;
import com.tourbooking.tour_management.entity.ServiceSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AvailabilityRepository extends JpaRepository<ServiceSlot, String> {

    @Query(value = "SELECT s.id AS slotId, s.service_id AS serviceId, s.start_time AS startTime, " +
            "s.max_capacity AS maxCapacity, CAST(:bookedDate AS DATE) AS bookedDate, " +
            "COALESCE(SUM(bi.quantity), 0) AS totalBooked, " +
            "(s.max_capacity - COALESCE(SUM(bi.quantity), 0)) AS remainingSeats " +
            "FROM service_slots s " +
            "LEFT JOIN booking_items bi ON s.service_id = bi.service_id AND s.start_time = bi.start_time_snap " +
            "  AND bi.booked_date = :bookedDate AND bi.status NOT IN ('REJECTED', 'CANCELLED') " +
            "LEFT JOIN bookings b ON bi.booking_id = b.id AND b.status IN ('SUCCESS', 'PENDING') " +
            "WHERE s.service_id = :serviceId AND s.active = true " +
            "GROUP BY s.id, s.service_id, s.start_time, s.max_capacity " +
            "ORDER BY s.start_time", nativeQuery = true)
    List<SlotAvailabilityDTO> getAvailableSlotsForDate(
            @Param("serviceId") String serviceId,
            @Param("bookedDate") LocalDate bookedDate);
}
