package com.tourbooking.tour_management.repository;

import com.tourbooking.tour_management.entity.Booking;
import com.tourbooking.tour_management.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface BookingRepository extends JpaRepository<Booking, String> {
    Optional<Booking> findFirstByCustomer_IdAndStatus(String customerId, BookingStatus status);
    // chỗ này lưu lịch sử đơn hàng
    List<Booking> findByCustomer_IdOrderByCreatedAtDesc(String customerId);
}