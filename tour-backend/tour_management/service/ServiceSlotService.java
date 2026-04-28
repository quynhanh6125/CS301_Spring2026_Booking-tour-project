package com.tourbooking.tour_management.service;

import com.tourbooking.tour_management.entity.ServiceSlot;
import java.util.List;

public interface ServiceSlotService {
    // Tạo mới một khung giờ cho Service
    ServiceSlot createSlot(String providerId, String serviceId, ServiceSlot slot);

    // Cập nhật khung giờ hoặc sức chứa (Chỉ khi chưa có ai đặt - Logic nâng cao)
    ServiceSlot updateSlot(String providerId, String slotId, ServiceSlot details);

    // Xóa slot (Soft delete bằng cách set active = false)
    void deleteSlot(String providerId, String slotId);

    // Lấy toàn bộ khung giờ của 1 Service cụ thể
    List<ServiceSlot> getSlotsByService(String serviceId);

    // khôi phục slot đã xóa mềm
    void restoreSlot(String providerId, String slotId);

}