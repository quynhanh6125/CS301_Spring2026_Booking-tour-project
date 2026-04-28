package com.tourbooking.tour_management.service;

import java.math.BigDecimal;

public interface VoucherService {
    BigDecimal calculateDiscount(String voucherCode);
}
