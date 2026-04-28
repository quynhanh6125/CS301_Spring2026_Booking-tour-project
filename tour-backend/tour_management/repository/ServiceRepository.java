package com.tourbooking.tour_management.repository;

import com.tourbooking.tour_management.entity.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.query.Param;

@Repository
public interface ServiceRepository extends JpaRepository<Service, String> {
    // Lấy tất cả dịch vụ đang hoạt động (cho khách hàng)
    List<Service> findByIsActiveTrue();

    // Lấy dịch vụ theo Provider
    List<Service> findByProviderId(String providerId);

    // Lấy các dịch vụ con của một Combo
    List<Service> findByParentId(String parentId);

    // Lấy các dịch vụ đã bị ẩn/xóa của Provider (để khôi phục)
    List<Service> findByProviderIdAndIsActiveFalse(String providerId);

    @Query(value = "SELECT s.id, s.name, s.image_url, s.description, s.price, s.duration, s.category, " +
            "ROUND(AVG(f.rating)::numeric, 1) as avg_rating, " +
            "COUNT(f.id) as review_count " +
            "FROM services s " +
            "LEFT JOIN feedbacks f ON s.id = f.service_id " +
            "WHERE s.is_active = true " +
            "GROUP BY s.id, s.name, s.image_url, s.description, s.price, s.duration, s.category", nativeQuery = true)
    List<Object[]> findAllServicesWithRatings();

    @Query(value = "SELECT * FROM services " +
            "WHERE is_active = true AND " +
            "to_tsvector('simple', name || ' ' || description) @@ to_tsquery('simple', :keyword)",
            nativeQuery = true)
    List<Service> searchServices(@Param("keyword") String keyword);

    @Query(value = "SELECT * FROM v_provider_dashboard WHERE provider_id = :pid", nativeQuery = true)
    List<Object[]> getProviderDashboardStats(@Param("pid") String providerId);

}