package com.tourbooking.tour_management.controller;

import com.tourbooking.tour_management.entity.Feedback;
import com.tourbooking.tour_management.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedbacks")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    // Khách hàng gửi đánh giá cho 1 món
    @PostMapping("/submit")
    public ResponseEntity<Feedback> submitFeedback(
            @RequestParam String itemId,
            @RequestParam Integer rating,
            @RequestBody(required = false) String comment) {
        return ResponseEntity.ok(feedbackService.createFeedback(itemId, rating, comment));
    }

    // Xem điểm trung bình của Tour (Dùng để hiện lên các thẻ Tour ở trang chủ)
    @GetMapping("/average/{serviceId}")
    public ResponseEntity<Double> getAverage(@PathVariable String serviceId) {
        return ResponseEntity.ok(feedbackService.getAverageRating(serviceId));
    }

    // Xem tất cả đánh giá của 1 Tour (Hiện ở trang chi tiết Tour)
    @GetMapping("/service/{serviceId}")
    public ResponseEntity<List<Feedback>> getByService(@PathVariable String serviceId) {
        return ResponseEntity.ok(feedbackService.getServiceFeedbacks(serviceId));
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<Feedback>> getProviderFeedbacks(@PathVariable String providerId) {
        return ResponseEntity.ok(feedbackService.getProviderFeedbacks(providerId));
    }
}