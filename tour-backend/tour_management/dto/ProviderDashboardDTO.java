package com.tourbooking.tour_management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProviderDashboardDTO {
    private String providerId;
    private String businessName;
    private Long totalServices;
    private Long totalBookings;
    private BigDecimal totalRevenue;
    private Double averageRating;
}