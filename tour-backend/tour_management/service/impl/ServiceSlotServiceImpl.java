package com.tourbooking.tour_management.service.impl;

import com.tourbooking.tour_management.entity.Service;
import com.tourbooking.tour_management.entity.ServiceSlot;
import com.tourbooking.tour_management.repository.ServiceRepository;
import com.tourbooking.tour_management.repository.ServiceSlotRepository;
import com.tourbooking.tour_management.service.PermissionService;
import com.tourbooking.tour_management.service.ServiceSlotService;
import com.tourbooking.tour_management.utils.IdGeneratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@org.springframework.stereotype.Service
public class ServiceSlotServiceImpl implements ServiceSlotService {

    @Autowired
    private ServiceSlotRepository slotRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private PermissionService permissionService;

    @Autowired
    private IdGeneratorService idGenerator;

    @Override
    @Transactional
    public ServiceSlot createSlot(String providerId, String serviceId, ServiceSlot slot) {
        // 1. Kiểm tra quyền: Chỉ chủ sở hữu Service mới được tạo Slot
        permissionService.canManageService(providerId, serviceId);

        // 2. Tìm Service gốc
        Service service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Dịch vụ không tồn tại với ID: " + serviceId));

        // 3. Thiết lập thông tin cho Slot mới
        slot.setId(idGenerator.generateId("SLOT", "slot_seq"));
        slot.setService(service);
        slot.setActive(true); // Mặc định là hoạt động khi mới tạo

        return slotRepository.save(slot);
    }

    @Override
    @Transactional
    public ServiceSlot updateSlot(String providerId, String slotId, ServiceSlot details) {
        // 1. Tìm Slot hiện tại
        ServiceSlot existingSlot = slotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khung giờ (Slot) với ID: " + slotId));

        // 2. Kiểm tra quyền sở hữu thông qua Service cha của Slot đó
        permissionService.canManageService(providerId, existingSlot.getService().getId());

        // 3. Cập nhật các thông tin cho phép
        if (details.getStartTime() != null) {
            existingSlot.setStartTime(details.getStartTime());
        }
        if (details.getMaxCapacity() != null) {
            existingSlot.setMaxCapacity(details.getMaxCapacity());
        }

        return slotRepository.save(existingSlot);
    }

    @Override
    @Transactional
    public void deleteSlot(String providerId, String slotId) {
        // 1. Tìm Slot
        ServiceSlot existingSlot = slotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khung giờ (Slot) với ID: " + slotId));

        // 2. Kiểm tra quyền sở hữu
        permissionService.canManageService(providerId, existingSlot.getService().getId());

        // 3. Thực hiện Soft Delete (Chuyển trạng thái active sang false)
        // Điều này quan trọng vì BookingItem cũ vẫn cần tham chiếu đến thông tin Slot này
        existingSlot.setActive(false);
        slotRepository.save(existingSlot);
    }

    @Override
    public List<ServiceSlot> getSlotsByService(String serviceId) {
        // Kiểm tra xem service có tồn tại không trước khi lấy list
        if (!serviceRepository.existsById(serviceId)) {
            throw new RuntimeException("Dịch vụ không tồn tại!");
        }

        // Gọi method từ Repository (Bạn cần thêm method này vào Repository)
        return slotRepository.findByServiceIdAndActiveTrue(serviceId);
    }

    @Override
    @Transactional
    public void restoreSlot(String providerId, String slotId) {
        ServiceSlot existingSlot = slotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Slot: " + slotId));

        // Kiểm tra quyền sở hữu
        permissionService.canManageService(providerId, existingSlot.getService().getId());

        // Khôi phục trạng thái
        existingSlot.setActive(true);
        slotRepository.save(existingSlot);
    }
}