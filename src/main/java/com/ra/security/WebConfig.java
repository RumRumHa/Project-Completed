package com.ra.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Cho tất cả các đường dẫn
                .allowedOrigins("http://localhost:5173", "http://localhost:5174", "http://localhost:5175") // Cho phép origin frontend
                .allowedMethods("*") // GET, POST, PUT, DELETE...
                .allowedHeaders("*") // Cho phép tất cả các header
                .allowCredentials(true); // Cho phép gửi cookie nếu cần
    }
}
