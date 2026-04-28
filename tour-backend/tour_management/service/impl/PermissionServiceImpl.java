package com.tourbooking.tour_management.service.impl;

import com.tourbooking.tour_management.entity.User;
import com.tourbooking.tour_management.entity.Service;
import com.tourbooking.tour_management.enums.UserRole;
import com.tourbooking.tour_management.repository.UserRepository;
import com.tourbooking.tour_management.repository.ServiceRepository;
import com.tourbooking.tour_management.service.PermissionService;
import org.springframework.beans.factory.annotation.Autowired;

@org.springframework.stereotype.Service
public class PermissionServiceImpl implements PermissionService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Override
    public void isProvider(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Lỗi bảo mật: Người dùng không tồn tại!"));

        if (user.getRole() != UserRole.PROVIDER) {
            throw new RuntimeException("Quyền truy cập bị từ chối: Bạn không phải là Nhà cung cấp!");
        }
    }

    @Override
    public void canManageService(String providerId, String serviceId) {
        // 1. Kiểm tra xem người này có phải provider không cái đã
        isProvider(providerId);

        // 2. Kiểm tra service có tồn tại không
        Service service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Lỗi: Dịch vụ không tồn tại!"));

        // 3. So sánh ID của chủ sở hữu service với ID người đang thao tác
        if (!service.getProvider().getId().equals(providerId)) {
            throw new RuntimeException("Lỗi bảo mật: Bạn không có quyền chỉnh sửa dịch vụ của nhà cung cấp khác!");
        }
    }

    @Override
    public void canAccessBooking(String userId, String bookingId) {
        // Logic này chúng ta sẽ viết khi làm tới phần BookingService nhé
        // Đại loại là: Chỉ khách đã đặt hoặc Provider sở hữu dịch vụ đó mới được xem.
    }
}