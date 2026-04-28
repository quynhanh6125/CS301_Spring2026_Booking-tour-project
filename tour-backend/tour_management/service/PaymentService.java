package com.tourbooking.tour_management.service;

import com.tourbooking.tour_management.enums.PaymentMethod;
import com.tourbooking.tour_management.enums.PaymentType;
import java.math.BigDecimal;

public interface PaymentService {
    void createPaymentRecord(String bookingId, PaymentMethod method, PaymentType type);
    // Hàm mới để tính: Tổng tiền khách trả - Tổng tiền đã hoàn lẻ
    BigDecimal getRefundableBalance(String bookingId);

    // Sửa hàm này để nhận thêm tham số amount
    void processRefund(String bookingId, PaymentMethod method, BigDecimal amount);


    void createPartialRefund(String bookingId, PaymentMethod method, BigDecimal refundAmount);
}
