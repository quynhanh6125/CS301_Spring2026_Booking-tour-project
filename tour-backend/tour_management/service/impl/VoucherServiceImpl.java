package com.tourbooking.tour_management.service.impl;

import com.tourbooking.tour_management.service.VoucherService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class VoucherServiceImpl implements VoucherService {

    @Override
    public BigDecimal calculateDiscount(String voucherCode) {
        if (voucherCode == null || voucherCode.trim().isEmpty()) {
            return BigDecimal.ZERO;
        }
        
        // Mock logic cho đồ án môn học
        if ("GIAM100K".equalsIgnoreCase(voucherCode)) {
            return new BigDecimal("100000");
        } else if ("GIAM200K".equalsIgnoreCase(voucherCode)) {
            return new BigDecimal("200000");
        } else if ("GIAM500K".equalsIgnoreCase(voucherCode)) {
            return new BigDecimal("500000");
        }
        
        throw new RuntimeException("Mã giảm giá không hợp lệ hoặc đã hết hạn!");
    }
}
