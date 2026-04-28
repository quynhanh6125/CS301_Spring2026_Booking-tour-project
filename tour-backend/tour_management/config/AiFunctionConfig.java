package com.tourbooking.tour_management.config;

import com.tourbooking.tour_management.dto.BookingRequest;
import com.tourbooking.tour_management.entity.Service;
import com.tourbooking.tour_management.entity.ServiceSlot;
import com.tourbooking.tour_management.service.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Description;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.function.Function;

@Configuration
public class AiFunctionConfig {

    // --- 1. NHÓM DỊCH VỤ & COMBO (ServiceService) ---

    @Bean
    @Description("Tìm kiếm tour theo từ khóa hoặc xem danh sách tất cả tour đang hoạt động")
    public Function<SearchRequest, Object> searchTours(ServiceService service) {
        return req -> req.q() != null ? service.searchServices(req.q()) : service.getAllServicesWithRatings();
    }

    @Bean
    @Description("Xem chi tiết tour, bao gồm thông tin mô tả và danh sách dịch vụ con nếu là Combo")
    public Function<IdRequest, Object> getTourDetails(ServiceService service) {
        return req -> java.util.Map.of(
                "detail", service.getServiceById(req.id()),
                "subServices", service.getSubServices(req.id())
        );
    }

    @Bean
    @Description("Hỗ trợ Provider quản lý tour: Cập nhật thông tin hoặc Sao chép (Clone) một dịch vụ lẻ vào gói Combo")
    public Function<ServiceActionRequest, Object> manageService(ServiceService service) {
        return req -> {
            if ("CLONE".equalsIgnoreCase(req.action())) {
                return service.addExistingToCombo(req.providerId(), req.serviceId(), req.targetId());
            } else if ("RESTORE".equalsIgnoreCase(req.action())) {
                service.restoreService(req.providerId(), req.serviceId());
                return "Đã khôi phục dịch vụ.";
            }
            return "Hành động không hợp lệ";
        };
    }

    // --- 2. NHÓM ĐẶT CHỖ, THANH TOÁN & HOÀN TIỀN (BookingManager & PaymentService) ---

    @Bean
    @Description("Kiểm tra khung giờ khởi hành và số chỗ còn lại của tour trong một ngày")
    public Function<AvailabilityRequest, Object> checkSlots(AvailabilityService service) {
        return req -> service.getAvailableSlotsForDate(req.serviceId(), LocalDate.parse(req.date()));
    }

    @Bean
    @Description("Thêm tour vào giỏ hàng (Áp dụng cho cả khách và chủ tour đặt cho mình)")
    public Function<BookingRequest, Object> addToCart(BookingManager manager) {
        return req -> manager.addServiceToBooking(
                req.getCustomerId(), req.getServiceId(), req.getBookedDate(), req.getStartTime(), req.getQuantity());
    }

    @Bean
    @Description("Xem giỏ hàng, lịch sử đặt tour hoặc kiểm tra số dư có thể hoàn trả trước khi hủy đơn")
    public Function<OrderQueryRequest, Object> queryOrders(BookingManager manager, PaymentService payment) {
        return req -> {
            if ("REFUND_CHECK".equalsIgnoreCase(req.type())) {
                return payment.getRefundableBalance(req.id());
            }
            try {
                return java.util.Map.of("cart", manager.getCart(req.id()), "history", manager.getCustomerBookingHistory(req.id()));
            } catch (Exception e) { return manager.getCustomerBookingHistory(req.id()); }
        };
    }

    @Bean
    @Description("Quản lý đơn hàng: Thanh toán, Áp mã voucher, Hủy đơn hoặc Xóa món khỏi giỏ hàng")
    public Function<OrderActionRequest, Object> manageOrder(BookingManager manager) {
        return req -> {
            switch (req.action().toUpperCase()) {
                case "PAY": manager.processPayment(req.orderId(), req.method()); return "Thanh toán thành công.";
                case "VOUCHER": return manager.applyVoucher(req.orderId(), req.extra());
                case "CANCEL": manager.cancelBooking(req.orderId()); return "Đã hủy đơn thành công.";
                case "REMOVE_ITEM": manager.removeItemFromCart(req.extra()); return "Đã xóa món khỏi giỏ.";
                default: return "Hành động không xác định.";
            }
        };
    }

    // --- 3. NHÓM VẬN HÀNH CHO PROVIDER (BookingManager & ServiceSlotService) ---

    @Bean
    @Description("Provider xem Dashboard thống kê, danh sách đơn khách đặt hoặc đánh giá từ khách hàng")
    public Function<ProviderQueryRequest, Object> providerInsights(ServiceService service, BookingManager manager, FeedbackService feedback) {
        return req -> {
            if ("FEEDBACK".equalsIgnoreCase(req.type())) return feedback.getProviderFeedbacks(req.providerId());
            return java.util.Map.of(
                    "stats", service.getProviderDashboard(req.providerId()),
                    "items", manager.getProviderItems(req.providerId())
            );
        };
    }

    @Bean
    @Description("Provider phê duyệt đơn hàng hoặc quản lý khung giờ (Slot): Tạo, Cập nhật, Khôi phục slot")
    public Function<ProviderActionRequest, Object> manageOperations(BookingManager manager, ServiceSlotService slotService) {
        return req -> {
            if ("CONFIRM".equalsIgnoreCase(req.action())) return manager.confirmProviderItem(req.providerId(), req.targetId());
            if ("REJECT".equalsIgnoreCase(req.action())) return manager.rejectProviderItem(req.providerId(), req.targetId());
            if ("RESTORE_SLOT".equalsIgnoreCase(req.action())) {
                slotService.restoreSlot(req.providerId(), req.targetId());
                return "Đã khôi phục khung giờ.";
            }
            return "Hành động thất bại.";
        };
    }

    @Bean
    @Description("Tạo khung giờ khởi hành mới cho tour (Provider)")
    public Function<CreateSlotRequest, Object> createTourSlot(ServiceSlotService service) {
        return req -> {
            ServiceSlot slot = new ServiceSlot();
            slot.setStartTime(LocalTime.parse(req.startTime()));
            slot.setMaxCapacity(req.maxCapacity());
            return service.createSlot(req.providerId(), req.serviceId(), slot);
        };
    }

    // --- 4. NHÓM ĐÁNH GIÁ (FeedbackService) ---

    @Bean
    @Description("Gửi đánh giá cho tour đã hoàn thành hoặc xem điểm trung bình của tour")
    public Function<FeedbackActionRequest, Object> manageFeedback(FeedbackService service) {
        return req -> req.itemId() != null
                ? service.createFeedback(req.itemId(), req.rating(), req.comment())
                : java.util.Map.of("avg", service.getAverageRating(req.serviceId()), "list", service.getServiceFeedbacks(req.serviceId()));
    }

    // --- DATA RECORDS ---
    public record SearchRequest(String q) {}
    public record IdRequest(String id) {}
    public record AvailabilityRequest(String serviceId, String date) {}
    public record OrderQueryRequest(String id, String type) {}
    public record OrderActionRequest(String orderId, String action, String method, String extra) {}
    public record ServiceActionRequest(String providerId, String serviceId, String action, String targetId) {}
    public record ProviderQueryRequest(String providerId, String type) {}
    public record ProviderActionRequest(String providerId, String action, String targetId) {}
    public record CreateSlotRequest(String providerId, String serviceId, String startTime, Integer maxCapacity) {}
    public record FeedbackActionRequest(String serviceId, String itemId, Integer rating, String comment) {}
}