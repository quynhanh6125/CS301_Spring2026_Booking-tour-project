package com.tourbooking.tour_management.repository;

import com.tourbooking.tour_management.entity.BookingItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookingItemRepository extends JpaRepository<BookingItem, String> {
    // tìm danh sách item theo ID của đơn hàng
    List<BookingItem> findByBookingId(String bookingId);

    // Lấy tất cả ngoại trừ PENDING (giỏ hàng)
    @Query("SELECT bi FROM BookingItem bi JOIN bi.booking b JOIN bi.service s " +
            "WHERE s.provider.id = :providerId " +
            "AND CAST(b.status AS string) != 'PENDING' " +
            "ORDER BY bi.bookedDate DESC")
    List<BookingItem> findByProviderId(@Param("providerId") String providerId);
}