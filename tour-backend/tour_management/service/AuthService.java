package com.tourbooking.tour_management.service;

import com.tourbooking.tour_management.entity.User;

public interface AuthService {
    User register(User user, String type);
    User login(String username, String password);
}