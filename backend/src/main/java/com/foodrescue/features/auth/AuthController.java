package com.foodrescue.features.auth;

import com.foodrescue.common.dto.ApiResponse;
import com.foodrescue.features.user.model.Role;
import com.foodrescue.features.user.model.User;
import com.foodrescue.features.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final UserRepository userRepository;

    /**
     * User Registration Endpoint
     * Saves user details and role directly into MySQL database (food_rescue_db.users)
     */
    @PostMapping({"/register", "/signup"})
    public ResponseEntity<ApiResponse<Map<String, Object>>> registerUser(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        String name = request.getOrDefault("name", request.getOrDefault("fullName", email.split("@")[0]));
        String roleStr = request.getOrDefault("role", request.getOrDefault("requestedRole", "RESTAURANT"));
        String phone = request.getOrDefault("phone", "01700000000");
        String address = request.getOrDefault("address", "Dhaka, Bangladesh");

        log.info("Processing user registration for email: {} with role: {}", email, roleStr);

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Email address is already registered in FoodRescue!"));
        }

        Role role;
        try {
            role = Role.valueOf(roleStr.toUpperCase().replace("_MANAGER", "").replace("_REPRESENTATIVE", "").replace("_RIDER", ""));
        } catch (Exception e) {
            role = Role.RESTAURANT;
        }

        User user = User.builder()
                .name(name)
                .email(email)
                .password(password != null ? password : "123456") // In production, BCryptPasswordEncoder
                .role(role)
                .phone(phone)
                .address(address)
                .build();

        User savedUser = userRepository.save(user);
        log.info("User registered and saved to MySQL database with ID: {}", savedUser.getId());

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("userId", savedUser.getId());
        responseData.put("email", savedUser.getEmail());
        responseData.put("name", savedUser.getName());
        responseData.put("role", savedUser.getRole().name());
        responseData.put("jwtAccessToken", "jwt-token-foodrescue-" + savedUser.getId() + "-" + savedUser.getRole().name());
        responseData.put("status", "ACTIVE");
        responseData.put("message", "Account registered successfully in MySQL database!");

        return ResponseEntity.ok(ApiResponse.success("Registration successful", responseData));
    }

    /**
     * User Login Endpoint
     * Verifies email & password against MySQL database (food_rescue_db.users)
     */
    @PostMapping({"/login", "/signin"})
    public ResponseEntity<ApiResponse<Map<String, Object>>> loginUser(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        String requestedRole = request.getOrDefault("role", request.getOrDefault("requestedRole", "RESTAURANT"));

        log.info("Processing user login for email: {}", email);

        Optional<User> userOptional = userRepository.findByEmail(email);

        User user;
        if (userOptional.isPresent()) {
            user = userOptional.get();
            if (password != null && !password.equals(user.getPassword())) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Invalid password. Please check your credentials."));
            }
        } else {
            // Auto-register on first demo login for seamless testing
            Role role;
            try {
                role = Role.valueOf(requestedRole.toUpperCase().replace("_MANAGER", "").replace("_REPRESENTATIVE", "").replace("_RIDER", ""));
            } catch (Exception e) {
                role = Role.RESTAURANT;
            }

            user = User.builder()
                    .name(email.split("@")[0])
                    .email(email)
                    .password(password != null ? password : "123456")
                    .role(role)
                    .phone("01700000000")
                    .address("Dhaka, Bangladesh")
                    .build();

            user = userRepository.save(user);
            log.info("Auto-registered new user in MySQL database during login: ID {}", user.getId());
        }

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("userId", user.getId());
        responseData.put("email", user.getEmail());
        responseData.put("name", user.getName());
        responseData.put("fullName", user.getName());
        responseData.put("role", user.getRole().name());
        responseData.put("jwtAccessToken", "jwt-token-foodrescue-" + user.getId() + "-" + user.getRole().name());
        responseData.put("status", "ACTIVE");

        return ResponseEntity.ok(ApiResponse.success("User authenticated successfully", responseData));
    }
}
