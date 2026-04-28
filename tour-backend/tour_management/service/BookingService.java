package com.tourbooking.tour_management.service;

import com.tourbooking.tour_management.entity.Booking;
import com.tourbooking.tour_management.entity.BookingItem;
import com.tourbooking.tour_management.enums.BookingStatus;
import com.tourbooking.tour_management.enums.ItemStatus;
import com.tourbooking.tour_management.entity.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface BookingService {
    Booking getOrCreatePendingCart(String customerId);
    Booking getCart(String customerId);
    BookingItem addItemToCart(String bookingId, Service originalService, LocalDate date, LocalTime time, int quantity);
    void removeItemFromCart(String itemId);
    Booking updateStatus(String bookingId, BookingStatus status);
    Booking applyDiscount(String bookingId, String voucherCode, BigDecimal discountAmount);
    Booking getBookingById(String bookingId);
    List<Booking> getCustomerBookingHistory(String customerId);
    
    // Quản lý riêng Item
    BookingItem getBookingItemById(String itemId);
    BookingItem updateItemStatus(String itemId, ItemStatus status);
    void syncBookingStatus(String bookingId);

}
