package com.tourbooking.tour_management.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // registry lúc này đã được nhận diện là một object của CorsRegistry
        registry.addMapping("/api/**") // Cho phép tất cả các đường dẫn bắt đầu bằng /api/
                .allowedOrigins("http://localhost:5173") // CHÍNH LÀ ĐÂY: Chấp nhận "ông" Frontend này
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH") // Cho phép các hành động này
                .allowCredentials(true); // Cho phép gửi kèm Cookie hoặc Token (nếu có)
    }
}