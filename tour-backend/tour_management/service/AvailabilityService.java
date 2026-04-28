package com.tourbooking.tour_management.service;

import com.tourbooking.tour_management.dto.SlotAvailabilityDTO;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface AvailabilityService {

    /**
     * Kiểm tra xem một dịch vụ vào ngày và giờ cụ thể còn đủ số lượng chỗ yêu cầu hay không.
     * * @param serviceId ID của dịch vụ cần kiểm tra
     * @param date Ngày khách hàng muốn đặt (booked_date)
     * @param startTime Khung giờ khởi hành (start_time_snap)
     * @param requestedQuantity Số lượng khách muốn đặt
     * @return true nếu còn đủ chỗ, false nếu không đủ
     */
    boolean checkAvailability(String serviceId, LocalDate date, LocalTime startTime, int requestedQuantity);

    /**
     * Lấy chính xác số chỗ còn trống hiện tại từ View v_available_slots.
     * * @param serviceId ID của dịch vụ
     * @param date Ngày cần kiểm tra
     * @param startTime Khung giờ cần kiểm tra
     * @return Số chỗ còn lại (Integer).
     */
    Integer getRemainingSeats(String serviceId, LocalDate date, LocalTime startTime);

    /**
     * Truy vấn thông tin sức chứa của tất cả các khung giờ trống cho 1 ngày cụ thể
     */
    List<SlotAvailabilityDTO> getAvailableSlotsForDate(String serviceId, LocalDate date);
}