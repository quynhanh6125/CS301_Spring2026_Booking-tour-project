package com.tourbooking.tour_management.service;

import com.tourbooking.tour_management.entity.User;

public interface UserService {
    User saveUser(User user, String prefix);
    boolean existsByUsername(String username);

}