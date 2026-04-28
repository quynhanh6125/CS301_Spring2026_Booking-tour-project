package com.tourbooking.tour_management.service;

import com.tourbooking.tour_management.entity.Booking;
import com.tourbooking.tour_management.entity.BookingItem;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface BookingManager {

    /**
     * Thêm một dịch vụ vào giỏ hàng.
     * Nếu khách chưa có đơn hàng PENDING, tự động tạo mới Booking.
     * Thực hiện kiểm tra chỗ trống và Snapshot thông tin (Giá, Tên).
     */
    BookingItem addServiceToBooking(String customerId, String serviceId, LocalDate date, LocalTime time, int quantity);

    /**
     * Xử lý thanh toán cho toàn bộ đơn hàng.
     * Tạo bản ghi Payment và chuyển trạng thái Booking sang SUCCESS.
     */
    void processPayment(String bookingId, String method);

    /**
     * Hủy toàn bộ đơn hàng.
     * Giải phóng tất cả các Slot trong giỏ (nhả chỗ) và thực hiện hoàn tiền nếu đã thanh toán.
     */
    void cancelBooking(String bookingId);

    /**
     * Lấy thông tin giỏ hàng hiện tại của khách hàng.
     */
    Booking getCart(String customerId);

    /**
     * Xóa một món cụ thể khỏi giỏ hàng.
     * Trigger SQL sẽ tự động tính lại tổng tiền cho Booking.
     */
    void removeItemFromCart(String itemId);

    /**
     * Nhập mã giảm giá và áp dụng vào giỏ hàng
     */
    Booking applyVoucher(String bookingId, String voucherCode);


    /**
     * Lấy danh sách tất cả các dịch vụ đã được khách đặt thuộc về một nhà cung cấp cụ thể.
     */
    List<BookingItem> getProviderItems(String providerId);


    /**
     * Cửa hàng xác nhận đơn lẻ
     */
    BookingItem confirmProviderItem(String providerId, String itemId);

    /**
     * Cửa hàng từ chối đơn lẻ (Có hoàn tiền tự động nếu đã thanh toán)
     */
    BookingItem rejectProviderItem(String providerId, String itemId);

    List<Booking> getCustomerBookingHistory(String customerId);
}