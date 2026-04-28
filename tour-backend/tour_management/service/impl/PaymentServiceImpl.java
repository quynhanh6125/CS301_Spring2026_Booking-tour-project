package com.tourbooking.tour_management.service.impl;

import com.tourbooking.tour_management.entity.Booking;
import com.tourbooking.tour_management.entity.Payment;
import com.tourbooking.tour_management.enums.PaymentMethod;
import com.tourbooking.tour_management.enums.PaymentType;
import com.tourbooking.tour_management.repository.BookingRepository;
import com.tourbooking.tour_management.repository.PaymentRepository;
import com.tourbooking.tour_management.service.PaymentService;
import com.tourbooking.tour_management.utils.IdGeneratorService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private IdGeneratorService idGenerator;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional
    public void createPaymentRecord(String bookingId, PaymentMethod method, PaymentType type) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng để thanh toán!"));

        // ĐỒNG BỘ: Đảm bảo số tiền thanh toán là con số "tươi" nhất từ DB
        entityManager.refresh(booking);

        Payment payment = new Payment();
        // Giã mã giả lập ID cho REF vs PAY
        String prefix = type == PaymentType.PAY ? "PAY" : "REF";
        payment.setId(idGenerator.generateId(prefix, "payment_seq"));
        payment.setBooking(booking);
        
        // Nếu là refund thì số tiền âm
        payment.setAmount(type == PaymentType.PAY ? booking.getFinalAmount() : booking.getFinalAmount().negate());
        payment.setType(type);
        payment.setMethod(method);

        paymentRepository.save(payment);
    }

    @Override
    public BigDecimal getRefundableBalance(String bookingId) {
        List<Payment> payments = paymentRepository.findByBookingId(bookingId);
        // Cộng tất cả amount lại: PAY (dương) + REFUND (âm) = Số dư thực tế khách còn trong hệ thống
        return payments.stream()
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Override
    @Transactional
    public void processRefund(String bookingId, PaymentMethod method, BigDecimal amount) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng!"));

        Payment payment = new Payment();
        payment.setId(idGenerator.generateId("REF", "payment_seq"));
        payment.setBooking(booking);

        // SỬA TẠI ĐÂY: Dùng trực tiếp con số truyền vào và negate nó
        payment.setAmount(amount.negate());
        payment.setType(PaymentType.REFUND);
        payment.setMethod(method);

        paymentRepository.save(payment);
    }

    @Override
    @Transactional
    public void createPartialRefund(String bookingId, PaymentMethod method, BigDecimal refundAmount) {
        // Tận dụng chính hàm processRefund để code ngắn gọn hơn
        processRefund(bookingId, method, refundAmount);
    }
}
