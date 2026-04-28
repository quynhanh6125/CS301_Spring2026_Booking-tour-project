package com.tourbooking.tour_management.controller;

import com.tourbooking.tour_management.entity.User;
import com.tourbooking.tour_management.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register/customer")
    public User registerCustomer(@RequestBody User user) {
        return authService.register(user, "CUSTOMER");
    }

    @PostMapping("/register/provider")
    public User registerProvider(@RequestBody User user) {
        return authService.register(user, "PROVIDER");
    }

    @PostMapping("/login")
    public User login(@RequestBody User loginRequest) {
        // loginRequest sẽ lấy username và password từ JSON gửi lên
        return authService.login(loginRequest.getUsername(), loginRequest.getPassword());
    }
}