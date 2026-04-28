package com.tourbooking.tour_management.service.impl;

import com.tourbooking.tour_management.entity.Booking;
import com.tourbooking.tour_management.entity.BookingItem;
import com.tourbooking.tour_management.entity.Service;
import com.tourbooking.tour_management.enums.BookingStatus;
import com.tourbooking.tour_management.enums.ItemStatus;
import com.tourbooking.tour_management.enums.PaymentMethod;
import com.tourbooking.tour_management.enums.PaymentType;
import com.tourbooking.tour_management.repository.BookingItemRepository;
import com.tourbooking.tour_management.service.AvailabilityService;
import com.tourbooking.tour_management.service.BookingManager;
import com.tourbooking.tour_management.service.BookingService;
import com.tourbooking.tour_management.service.PaymentService;
import com.tourbooking.tour_management.service.PermissionService;
import com.tourbooking.tour_management.service.ServiceService;
import com.tourbooking.tour_management.service.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class BookingManagerImpl implements BookingManager {

    private final AvailabilityService availabilityService;
    private final ServiceService serviceService;
    private final BookingService bookingService;
    private final PaymentService paymentService;
    private final VoucherService voucherService;
    private final PermissionService permissionService;
    private final BookingItemRepository itemRepository;

    @Override
    @Transactional
    public BookingItem addServiceToBooking(String customerId, String serviceId, LocalDate date, LocalTime time, int quantity) {
        // 1. Kiểm tra chỗ trống
        boolean isAvailable = availabilityService.checkAvailability(serviceId, date, time, quantity);
        if (!isAvailable) {
            throw new RuntimeException("Xin lỗi, khung giờ này đã hết chỗ!");
        }

        // 2. Lấy Service gốc để Snapshot
        Service originalService = serviceService.getServiceById(serviceId);
        if (originalService == null) {
            throw new RuntimeException("Dịch vụ không tồn tại!");
        }

        // 3. Tìm hoặc tạo giỏ hàng (Booking PENDING)
        Booking cart = bookingService.getOrCreatePendingCart(customerId);

        // 4. Ủy quyền BookingService Snapshot thông tin vào BookingItem
        return bookingService.addItemToCart(cart.getId(), originalService, date, time, quantity);
    }

    @Override
    @Transactional
    public void processPayment(String bookingId, String method) {
        Booking booking = bookingService.getBookingById(bookingId);

        // CHỐT CHẶN: Nếu đã là PAID hoặc SUCCESS thì không cho thanh toán nữa
        if (booking.getStatus() == BookingStatus.PAID || booking.getStatus() == BookingStatus.SUCCESS) {
            throw new RuntimeException("Đơn hàng này đã được thanh toán rồi, vui lòng không thanh toán lại!");
        }

        // 1. Chuyển trạng thái Booking sang PAID (Đã trả tiền)
        bookingService.updateStatus(bookingId, BookingStatus.PAID);

        // 2. Lưu vết thanh toán
        PaymentMethod paymentMethod;
        try {
            paymentMethod = PaymentMethod.valueOf(method.toUpperCase());
        } catch (IllegalArgumentException e) {
            paymentMethod = PaymentMethod.BANK_TRANSFER;
        }

        paymentService.createPaymentRecord(bookingId, paymentMethod, PaymentType.PAY);
    }

    @Override
    @Transactional
    public void cancelBooking(String bookingId) {
        Booking booking = bookingService.getBookingById(bookingId);

        if (booking.getStatus() == BookingStatus.PENDING) {
            throw new RuntimeException("Đơn hàng chưa thanh toán, vui lòng chỉnh sửa trong giỏ hàng.");
        }

        // 1. Tính toán số tiền thực tế có thể hoàn trả (Sau khi trừ các món bị Reject trước đó)
        BigDecimal balance = paymentService.getRefundableBalance(bookingId);

        // 2. Chuyển trạng thái đơn hàng
        bookingService.updateStatus(bookingId, BookingStatus.CANCELLED);

        // 3. Logic hoàn tiền thông minh
        if (balance.compareTo(BigDecimal.ZERO) > 0) { // Chỉ hoàn nếu khách vẫn còn dư tiền trong đơn
            boolean eligibleForRefund = false;
            if (booking.getCreatedAt() != null) {
                eligibleForRefund = java.time.LocalDateTime.now().isBefore(booking.getCreatedAt().plusHours(24));
            }

            if (eligibleForRefund) {
                // 4. CHỐT HẠ: Chỉ hoàn đúng số tiền còn dư (balance)
                paymentService.processRefund(bookingId, PaymentMethod.BANK_TRANSFER, balance);
            }
        }
    }

    @Override
    public Booking getCart(String customerId) {
        return bookingService.getCart(customerId);
    }

    @Override
    @Transactional
    public void removeItemFromCart(String itemId) {
        bookingService.removeItemFromCart(itemId);
    }

    @Override
    @Transactional
    public Booking applyVoucher(String bookingId, String voucherCode) {
        // Dịch vụ Voucher check mã
        BigDecimal discount = voucherService.calculateDiscount(voucherCode);
        
        // Điều phối BookingService cập nhật giá cuối
        return bookingService.applyDiscount(bookingId, voucherCode, discount);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingItem> getProviderItems(String providerId) {
        // 1. Kiểm tra tính hợp lệ của Provider (sử dụng logic bạn đã viết trong PermissionService)
        permissionService.isProvider(providerId);

        // 2. Trả về danh sách item từ Repository
        return itemRepository.findByProviderId(providerId);
    }



    @Override
    @Transactional
    public BookingItem confirmProviderItem(String providerId, String itemId) {
        // 1. Lấy thông tin item và kiểm tra quyền của Provider
        BookingItem item = bookingService.getBookingItemById(itemId);
        permissionService.canManageService(providerId, item.getService().getId());

        // 2. Cập nhật trạng thái item thành CONFIRMED
        BookingItem confirmedItem = bookingService.updateItemStatus(itemId, ItemStatus.CONFIRMED);

        // 3. Bảo đơn hàng mẹ kiểm tra lại: "Nếu tất cả đã xong thì đổi Booking thành SUCCESS"
        bookingService.syncBookingStatus(confirmedItem.getBooking().getId());

        return confirmedItem;
    }

    @Override
    @Transactional
    public BookingItem rejectProviderItem(String providerId, String itemId) {
        // 1. Lấy thông tin và kiểm tra quyền (giữ nguyên)
        BookingItem item = bookingService.getBookingItemById(itemId);
        permissionService.canManageService(providerId, item.getService().getId());

        // 2. Cập nhật item sang REJECTED
        BookingItem rejectedItem = bookingService.updateItemStatus(itemId, ItemStatus.REJECTED);
        String bookingId = rejectedItem.getBooking().getId();

        // 3. Đồng bộ trạng thái đơn mẹ (Lên SUCCESS nếu các món khác đã xong, hoặc FAILED nếu hỏng hết)
        bookingService.syncBookingStatus(bookingId);

        // 4. Lấy lại object Booking để có trạng thái mới nhất sau khi sync
        Booking booking = bookingService.getBookingById(bookingId);

        // 5. CHỈNH SỬA LOGIC HOÀN TIỀN:
        // Chỉ cần đơn hàng ĐÃ THANH TOÁN (PAID, SUCCESS hoặc FAILED)
        // thì khi reject món nào, phải tạo bản ghi hoàn tiền món đó ngay.
        if (booking.getStatus() != BookingStatus.PENDING && booking.getStatus() != BookingStatus.CANCELLED) {
            BigDecimal refundAmount = rejectedItem.getCapturedPrice()
                    .multiply(BigDecimal.valueOf(rejectedItem.getQuantity()));

            // Gọi service tạo bản ghi hoàn tiền (loại REFUND)
            paymentService.createPartialRefund(bookingId, PaymentMethod.BANK_TRANSFER, refundAmount);
        }

        return rejectedItem;
    }
    @Override
    @Transactional(readOnly = true)
    public List<Booking> getCustomerBookingHistory(String customerId) {
        // 1. (Tùy chọn) có thể dùng permissionService để kiểm tra xem
        // người yêu cầu có đúng là chủ nhân của customerId không nếu cần bảo mật cao.

        // 2. Gọi service để lấy danh sách đơn hàng
        return bookingService.getCustomerBookingHistory(customerId);
    }
}