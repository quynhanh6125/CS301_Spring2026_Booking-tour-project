package com.tourbooking.tour_management.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class BookingRequest {
    private String customerId;
    private String serviceId;
    private LocalDate bookedDate;
    private LocalTime startTime;
    private int quantity;
}