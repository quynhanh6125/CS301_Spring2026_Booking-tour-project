package com.tourbooking.tour_management.dto;

import java.time.LocalTime;
import java.time.LocalDate;

public interface SlotAvailabilityDTO {
    String getSlotId();
    String getServiceId();
    LocalTime getStartTime();
    Integer getMaxCapacity();
    LocalDate getBookedDate();
    Integer getTotalBooked();
    Integer getRemainingSeats();
}
