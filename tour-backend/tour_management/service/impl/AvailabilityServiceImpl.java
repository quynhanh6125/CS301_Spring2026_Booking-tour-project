package com.tourbooking.tour_management.service.impl;

import com.tourbooking.tour_management.dto.SlotAvailabilityDTO;
import com.tourbooking.tour_management.repository.AvailabilityRepository;
import com.tourbooking.tour_management.service.AvailabilityService;
import org.springframework.beans.factory.annotation.Autowired;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@org.springframework.stereotype.Service
public class AvailabilityServiceImpl implements AvailabilityService {

    @Autowired
    private AvailabilityRepository availabilityRepository;

    // 1. PHƯƠNG THỨC CHỦ LỰC: Lấy mọi thứ từ Repository
    @Override
    public List<SlotAvailabilityDTO> getAvailableSlotsForDate(String serviceId, LocalDate date) {
        return availabilityRepository.getAvailableSlotsForDate(serviceId, date);
    }

    // 2. TẬN DỤNG: Lọc từ danh sách trên để lấy chỗ trống của 1 giờ cụ thể
    @Override
    public Integer getRemainingSeats(String serviceId, LocalDate date, LocalTime startTime) {
        return getAvailableSlotsForDate(serviceId, date).stream()
                .filter(slot -> slot.getStartTime().equals(startTime))
                .findFirst()
                .map(SlotAvailabilityDTO::getRemainingSeats)
                .orElse(null);
    }

    // 3. TẬN DỤNG: Dùng kết quả của getRemainingSeats để trả về true/false
    @Override
    public boolean checkAvailability(String serviceId, LocalDate date, LocalTime startTime, int requestedQuantity) {
        Integer remaining = getRemainingSeats(serviceId, date, startTime);
        if (remaining == null) return false; // nếu slot không tồn tại
        return remaining >= requestedQuantity;
    }
}