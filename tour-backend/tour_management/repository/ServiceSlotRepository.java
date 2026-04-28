package com.tourbooking.tour_management.repository;

import com.tourbooking.tour_management.entity.ServiceSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ServiceSlotRepository extends JpaRepository<ServiceSlot, String> {
    // Truy vấn các slot đang hoạt động của một Service cụ thể
    List<ServiceSlot> findByServiceIdAndActiveTrue(String serviceId);
}