package com.tourbooking.tour_management.service;



public interface PermissionService {
    // Kiểm tra xem ID này có phải là tài khoản Provider hợp lệ không
    void isProvider(String userId);

    // Kiểm tra xem Provider (providerId) có quyền sở hữu/quản lý Service (serviceId) này không
    void canManageService(String providerId, String serviceId);

    // Kiểm tra xem User này có quyền xem thông tin nhạy cảm của đơn hàng không
    // (Dùng cho BookingService sau này)
    void canAccessBooking(String userId, String bookingId);
}