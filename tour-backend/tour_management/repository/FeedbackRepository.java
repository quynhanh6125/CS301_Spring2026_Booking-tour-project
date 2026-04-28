package com.tourbooking.tour_management.repository;

import com.tourbooking.tour_management.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, String> {
    // Tìm danh sách đánh giá của một dịch vụ cụ thể
    List<Feedback> findByServiceIdOrderByCreatedAtDesc(String serviceId);

    // Kiểm tra xem món này đã được đánh giá chưa (Ràng buộc UNIQUE)
    boolean existsByBookingItemId(String bookingItemId);

    // Tính điểm trung bình (Sử dụng toán tử ép kiểu :: của Postgres cho chính xác)
    @Query(value = "SELECT ROUND(AVG(rating)::numeric, 1) FROM feedbacks WHERE service_id = :sid",
            nativeQuery = true)
    Double getAverageRating(@Param("sid") String serviceId);

    @Query(value = "SELECT COUNT(*) FROM feedbacks WHERE service_id = :sid", nativeQuery = true)
    Long getFeedbackCount(@Param("sid") String serviceId);

    List<Feedback> findByBookingItem_Service_Provider_IdOrderByCreatedAtDesc(String providerId);
}