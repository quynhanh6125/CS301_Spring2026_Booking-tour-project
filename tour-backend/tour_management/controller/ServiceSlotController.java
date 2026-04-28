package com.tourbooking.tour_management.controller;

import com.tourbooking.tour_management.entity.ServiceSlot;
import com.tourbooking.tour_management.service.ServiceSlotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/service-slots")
public class ServiceSlotController {

    @Autowired
    private ServiceSlotService slotService;

    // 1. Tạo khung giờ mới (Slot) cho một Service cụ thể
    // URL ví dụ: POST /api/service-slots/create/SERV001?providerId=USER001
    @PostMapping("/create/{serviceId}")
    public ResponseEntity<ServiceSlot> createSlot(
            @PathVariable String serviceId,
            @RequestParam String providerId,
            @RequestBody ServiceSlot slot) {
        return ResponseEntity.ok(slotService.createSlot(providerId, serviceId, slot));
    }

    // 2. Cập nhật khung giờ hoặc sức chứa của Slot
    @PutMapping("/{slotId}")
    public ResponseEntity<ServiceSlot> updateSlot(
            @PathVariable String slotId,
            @RequestParam String providerId,
            @RequestBody ServiceSlot details) {
        return ResponseEntity.ok(slotService.updateSlot(providerId, slotId, details));
    }

    // 3. Xóa khung giờ (Soft Delete - Đổi active thành false)
    @DeleteMapping("/{slotId}")
    public ResponseEntity<String> deleteSlot(
            @PathVariable String slotId,
            @RequestParam String providerId) {
        slotService.deleteSlot(providerId, slotId);
        return ResponseEntity.ok("Đã ẩn khung giờ khởi hành thành công!");
    }

    // 4. Lấy danh sách các khung giờ (Slot) của một Service (Dành cho khách hàng chọn)
    @GetMapping("/service/{serviceId}")
    public ResponseEntity<List<ServiceSlot>> getSlotsByService(@PathVariable String serviceId) {
        return ResponseEntity.ok(slotService.getSlotsByService(serviceId));
    }

    @PatchMapping("/{slotId}/restore")
    public ResponseEntity<String> restoreSlot(
            @PathVariable String slotId,
            @RequestParam String providerId) {
        slotService.restoreSlot(providerId, slotId);
        return ResponseEntity.ok("Khung giờ khởi hành đã được khôi phục thành công!");
    }
}