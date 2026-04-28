package com.tourbooking.tour_management.service;
import java.util.List;
import com.tourbooking.tour_management.entity.Feedback;

public interface FeedbackService {
    Feedback createFeedback(String itemId, Integer rating, String comment);
    List<Feedback> getServiceFeedbacks(String serviceId);
    Double getAverageRating(String serviceId);
    List<Feedback> getProviderFeedbacks(String providerId);

}
