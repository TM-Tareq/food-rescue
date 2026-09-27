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

    @PostMapping({"/login", "/signin"})
    public ResponseEntity<ApiResponse<Map<String, Object>>> loginUser(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        String requestedRole = request.getOrDefault("role", request.getOrDefault("requestedRole", "RESTAURANT"));

        log.info("Processing user login attempt for email: {}", email);

        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Email address is required."));
        }

        Optional<User> userOptional = userRepository.findByEmail(email.trim().toLowerCase());

        if (userOptional.isEmpty()) {
            log.warn("Login failed: User email {} not found in database.", email);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Account not found in database. Only registered database users can log in."));
        }

        User user = userOptional.get();

        if ("DISABLED".equalsIgnoreCase(user.getStatus())) {
            log.warn("Login blocked: Account {} is suspended.", email);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("⛔ Account is suspended by Super Admin. Please contact support."));
        }

        if (password == null || !password.equals(user.getPassword())) {
            log.warn("Login failed: Incorrect password for user {}", email);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Invalid password. Please check your credentials."));
        }

        // Enforce strict Super Admin role check if attempting to log into Admin portal
        if ("ADMIN".equalsIgnoreCase(requestedRole) && user.getRole() != Role.ADMIN) {
            log.warn("Access denied: User {} with role {} attempted to log into Admin Portal.", email, user.getRole());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Access denied. Admin portal requires Super Admin privileges."));
        }

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("userId", user.getId());
        responseData.put("email", user.getEmail());
        responseData.put("name", user.getName());
        responseData.put("fullName", user.getName());
        responseData.put("role", user.getRole().name());
        responseData.put("jwtAccessToken", "jwt-token-foodrescue-" + user.getId() + "-" + user.getRole().name());
        responseData.put("status", "ACTIVE");

        log.info("User {} authenticated successfully as {}", user.getEmail(), user.getRole());
        return ResponseEntity.ok(ApiResponse.success("User authenticated successfully", responseData));
    }
}
