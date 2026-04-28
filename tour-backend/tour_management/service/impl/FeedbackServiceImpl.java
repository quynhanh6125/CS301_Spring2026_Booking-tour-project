package com.tourbooking.tour_management.service.impl;
import com.tourbooking.tour_management.entity.Feedback;
import com.tourbooking.tour_management.enums.BookingStatus;
import com.tourbooking.tour_management.service.PermissionService;
import org.springframework.transaction.annotation.Transactional;
import com.tourbooking.tour_management.repository.BookingItemRepository;
import com.tourbooking.tour_management.repository.FeedbackRepository;
import com.tourbooking.tour_management.service.FeedbackService;
import com.tourbooking.tour_management.utils.IdGeneratorService;
import lombok.RequiredArgsConstructor;

import java.util.List;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class FeedbackServiceImpl implements FeedbackService {
    private final FeedbackRepository feedbackRepo;
    private final BookingItemRepository itemRepo;
    private final IdGeneratorService idGen;
    private final PermissionService permissionService;

    @Override
    @Transactional
    public Feedback createFeedback(String itemId, Integer rating, String comment) {
        // 1. Kiểm tra BookingItem
        var item = itemRepo.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin đặt chỗ!"));

        // 2. Chỉ cho đánh giá nếu đơn hàng đã SUCCESS
        if (!"SUCCESS".equals(item.getBooking().getStatus().name())) {
            throw new RuntimeException("Bạn chỉ có thể đánh giá dịch vụ đã hoàn thành thanh toán!");
        }

        // 3. Chặn đánh giá trùng lặp
        if (feedbackRepo.existsByBookingItemId(itemId)) {
            throw new RuntimeException("Dịch vụ này đã được bạn đánh giá trước đó.");
        }

        // 4. Lưu Feedback
        Feedback fb = new Feedback();
        fb.setId(idGen.generateId("FBK", "feedback_seq"));
        fb.setBookingItem(item);
        fb.setService(item.getService());
        fb.setCustomer(item.getBooking().getCustomer());
        fb.setRating(rating);
        fb.setComment(comment);
        fb.setCreatedAt(java.time.LocalDateTime.now());

        return feedbackRepo.save(fb);
    }

    @Override
    public List<Feedback> getServiceFeedbacks(String serviceId) {
        return feedbackRepo.findByServiceIdOrderByCreatedAtDesc(serviceId);
    }

    @Override
    public Double getAverageRating(String serviceId) {
        Double avg = feedbackRepo.getAverageRating(serviceId);
        return (avg != null) ? avg : 0.0;
    }

    @Override
    public List<Feedback> getProviderFeedbacks(String providerId) {
        // Kiểm tra xem providerId có tồn tại không trước khi lấy (tùy chọn)
        permissionService.isProvider(providerId);

        return feedbackRepo.findByBookingItem_Service_Provider_IdOrderByCreatedAtDesc(providerId);
    }
}