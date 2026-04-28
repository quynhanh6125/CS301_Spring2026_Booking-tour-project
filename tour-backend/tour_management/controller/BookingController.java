package com.tourbooking.tour_management.controller;

import com.tourbooking.tour_management.dto.BookingRequest;
import com.tourbooking.tour_management.dto.SlotAvailabilityDTO;
import com.tourbooking.tour_management.entity.Booking;
import com.tourbooking.tour_management.entity.BookingItem;
import com.tourbooking.tour_management.service.AvailabilityService;
import com.tourbooking.tour_management.service.BookingManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingManager bookingManager;

    @Autowired
    private AvailabilityService availabilityService;

    // 1. Xem danh sách khung giờ còn trống trong 1 ngày cụ thể (Read Flow)
    @GetMapping("/slots")
    public ResponseEntity<List<SlotAvailabilityDTO>> getAvailableSlots(
            @RequestParam String serviceId,
            @RequestParam String date) {
        // Parse date
        LocalDate localDate = LocalDate.parse(date);
        return ResponseEntity.ok(availabilityService.getAvailableSlotsForDate(serviceId, localDate));
    }

    // 2. Endpoint thêm vào giỏ hàng
    @PostMapping("/add-item")
    public ResponseEntity<BookingItem> addItem(@RequestBody BookingRequest request) {
        BookingItem item = bookingManager.addServiceToBooking(
                request.getCustomerId(),
                request.getServiceId(),
                request.getBookedDate(),
                request.getStartTime(),
                request.getQuantity()
        );
        return ResponseEntity.ok(item);
    }

    // New: Remove item from cart
    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<String> removeItem(@PathVariable String itemId) {
        bookingManager.removeItemFromCart(itemId);
        return ResponseEntity.ok("Đã xóa món hàng khỏi giỏ hàng!");
    }

    // 3. Endpoint áp dụng mã giảm giá
    @PostMapping("/{bookingId}/voucher")
    public ResponseEntity<Booking> applyVoucher(@PathVariable String bookingId, @RequestParam String voucherCode) {
        Booking updatedCart = bookingManager.applyVoucher(bookingId, voucherCode);
        return ResponseEntity.ok(updatedCart);
    }

    // 4. Endpoint giả lập thanh toán
    @PostMapping("/{bookingId}/pay")
    public ResponseEntity<String> pay(@PathVariable String bookingId, @RequestParam String method) {
        bookingManager.processPayment(bookingId, method);
        return ResponseEntity.ok("Thanh toán thành công qua " + method);
    }

    // 5. Endpoint hủy đơn hàng
    @PostMapping("/{bookingId}/cancel")
    public ResponseEntity<String> cancel(@PathVariable String bookingId) {
        bookingManager.cancelBooking(bookingId);
        return ResponseEntity.ok("Đã hủy đơn hàng và thực hiện hoàn tiền (nếu có)");
    }

    // 6. Xem giỏ hàng hiện tại
    @GetMapping("/cart/{customerId}")
    public ResponseEntity<?> getCart(@PathVariable String customerId) {
        try {
            return ResponseEntity.ok(bookingManager.getCart(customerId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(java.util.Collections.singletonMap("message", e.getMessage()));
        }
    }


    @GetMapping("/provider/{providerId}/items")
    public ResponseEntity<List<BookingItem>> getProviderItems(@PathVariable String providerId) {
        return ResponseEntity.ok(bookingManager.getProviderItems(providerId));
    }

    // 7. Cửa hàng xác nhận đơn lẻ (Provider)
    @PostMapping("/items/{itemId}/confirm")
    public ResponseEntity<BookingItem> confirmProviderItem(@PathVariable String itemId, @RequestParam String providerId) {
        BookingItem item = bookingManager.confirmProviderItem(providerId, itemId);
        return ResponseEntity.ok(item);
    }

    // 8. Cửa hàng từ chối đơn lẻ (Provider)
    @PostMapping("/items/{itemId}/reject")
    public ResponseEntity<BookingItem> rejectProviderItem(@PathVariable String itemId, @RequestParam String providerId) {
        BookingItem item = bookingManager.rejectProviderItem(providerId, itemId);
        return ResponseEntity.ok(item);
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Booking>> getCustomerHistory(@PathVariable String customerId) {
        List<Booking> history = bookingManager.getCustomerBookingHistory(customerId);
        return ResponseEntity.ok(history);
    }
}