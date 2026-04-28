package com.tourbooking.tour_management.service.impl;

import com.tourbooking.tour_management.entity.User;
import com.tourbooking.tour_management.enums.UserRole;
import com.tourbooking.tour_management.service.AuthService;
import com.tourbooking.tour_management.service.UserService;
import com.tourbooking.tour_management.repository.UserRepository;
import com.tourbooking.tour_management.utils.PasswordUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;
    @Override
    public User register(User user, String type) {
        // 1. Kiểm tra trùng username trước khi thực hiện bất kỳ logic nào khác
        // Việc này giúp tiết kiệm tài nguyên và không làm nhảy số Sequence ID nếu lỗi
        if (userService.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại trên hệ thống!");
        }

        // 2. Băm mật khẩu bằng SHA-256 (Dùng class PasswordUtils tự viết)
        // Thay thế hoàn toàn cho BCryptPasswordEncoder của Spring Security
        String hashed = PasswordUtils.hashPassword(user.getPassword());
        user.setPassword(hashed);

        // 3. Phân loại vai trò và lưu trữ thông qua UserService
        if ("PROVIDER".equalsIgnoreCase(type)) {
            user.setRole(UserRole.PROVIDER);
            // Gọi UserService với tiền tố ID là PROV
            return userService.saveUser(user, "PROV");
        } else {
            user.setRole(UserRole.CUSTOMER);
            // Gọi UserService với tiền tố ID là CUST
            return userService.saveUser(user, "CUST");
        }
    }

    @Override
    public User login(String username, String password) {
        // 1. Tìm user trong DB
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Tên đăng nhập không tồn tại!"));

        // 2. Băm mật khẩu người dùng nhập vào để so sánh
        String inputHashed = PasswordUtils.hashPassword(password);

        // 3. Kiểm tra xem chuỗi băm có khớp không
        if (!user.getPassword().equals(inputHashed)) {
            throw new RuntimeException("Mật khẩu không chính xác!");
        }

        // 4. Trả về user nếu thành công (Sau này ta sẽ trả về Token ở đây)
        return user;
    }
}