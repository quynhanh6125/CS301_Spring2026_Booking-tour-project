package com.tourbooking.tour_management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class ServiceResponseDTO {
    private String id;
    private String name;
    private String imageUrl;
    private String description;
    private BigDecimal price;
    private String duration;
    private String category;
    private Double avgRating;
    private Long reviewCount;
}
