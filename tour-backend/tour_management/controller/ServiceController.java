package com.tourbooking.tour_management.controller;

import com.tourbooking.tour_management.dto.ServiceResponseDTO;
import com.tourbooking.tour_management.entity.Service;
import com.tourbooking.tour_management.service.ServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    @Autowired
    private ServiceService serviceService;

    // 1. Tạo dịch vụ mới (Combo hoặc Single)
    @PostMapping("/create")
    public ResponseEntity<Service> createService(@RequestBody Service service) {
        return ResponseEntity.ok(serviceService.createService(service));
    }

    // 2. Cập nhật thông tin dịch vụ
    // Lưu ý: Cần truyền providerId để PermissionService kiểm tra quyền sở hữu
    @PutMapping("/{id}")
    public ResponseEntity<Service> updateService(
            @PathVariable String id,
            @RequestParam String providerId,
            @RequestBody Service serviceDetails) {
        return ResponseEntity.ok(serviceService.updateService(providerId, id, serviceDetails));
    }

    // 3. Xóa mềm dịch vụ (Soft Delete - Đổi isActive thành false)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteService(
            @PathVariable String id,
            @RequestParam String providerId) {
        serviceService.deleteService(providerId, id);
        return ResponseEntity.ok("Đã ẩn dịch vụ thành công!");
    }

    // 4. Khôi phục dịch vụ đã xóa
    @PatchMapping("/{id}/restore")
    public ResponseEntity<String> restoreService(
            @PathVariable String id,
            @RequestParam String providerId) {
        serviceService.restoreService(providerId, id);
        return ResponseEntity.ok("Dịch vụ đã được khôi phục thành công!");
    }

    // 5. Tính năng Clone: Thêm một dịch vụ lẻ có sẵn vào làm thành viên của Combo
    @PostMapping("/{parentId}/add-member/{serviceId}")
    public ResponseEntity<Service> addMemberToCombo(
            @PathVariable String parentId,
            @PathVariable String serviceId,
            @RequestParam String providerId) {
        Service clonedService = serviceService.addExistingToCombo(providerId, serviceId, parentId);
        return ResponseEntity.ok(clonedService);
    }

    // 6. Khách hàng xem danh sách dịch vụ đang hoạt động
    @GetMapping("/all")
    public ResponseEntity<List<ServiceResponseDTO>> getAllServices() {
        return ResponseEntity.ok(serviceService.getAllServicesWithRatings());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Service>> search(@RequestParam String q) {
        return ResponseEntity.ok(serviceService.searchServices(q));
    }

    // 7. Xem chi tiết một dịch vụ
    @GetMapping("/{id}")
    public ResponseEntity<Service> getServiceById(@PathVariable String id) {
        return ResponseEntity.ok(serviceService.getServiceById(id));
    }

    // 8. Provider xem danh sách dịch vụ của mình
    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<Service>> getServicesByProvider(@PathVariable String providerId) {
        return ResponseEntity.ok(serviceService.getServicesByProvider(providerId));
    }

    // 9. Xem danh sách dịch vụ thành phần (Sub-services) của một Combo
    @GetMapping("/{id}/sub-services")
    public ResponseEntity<List<Service>> getSubServices(@PathVariable String id) {
        return ResponseEntity.ok(serviceService.getSubServices(id));
    }

    @GetMapping("/provider/{providerId}/dashboard")
    public ResponseEntity<com.tourbooking.tour_management.dto.ProviderDashboardDTO> getProviderDashboard(
            @PathVariable String providerId) {
        return ResponseEntity.ok(serviceService.getProviderDashboard(providerId));
    }

}