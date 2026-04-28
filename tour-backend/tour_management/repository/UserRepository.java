package com.tourbooking.tour_management.repository;

import com.tourbooking.tour_management.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    boolean existsByUsername(String username); // Thêm dòng này
    Optional<User> findByUsername(String username);
}