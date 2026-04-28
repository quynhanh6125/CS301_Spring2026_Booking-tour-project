package com.tourbooking.tour_management.service.impl;

import com.tourbooking.tour_management.entity.User;
import com.tourbooking.tour_management.repository.UserRepository;
import com.tourbooking.tour_management.service.UserService;
import com.tourbooking.tour_management.utils.IdGeneratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private IdGeneratorService idGenerator;

    @Override
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    public User saveUser(User user, String prefix) {
        user.setId(idGenerator.generateId(prefix, "user_seq"));
        return userRepository.save(user);
    }
}