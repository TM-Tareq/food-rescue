package com.foodrescue.features.auth;

import com.foodrescue.common.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @PostMapping("/signin")
    public ResponseEntity<ApiResponse<Map<String, Object>>> signIn(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String role = request.getOrDefault("role", "RESTAURANT");

        Map<String, Object> responseData = Map.of(
            "email", email,
            "role", role,
            "token", "mock-jwt-token-foodrescue-2026",
            "status", "ACTIVE"
        );

        return ResponseEntity.ok(ApiResponse.success("Partner signed in successfully", responseData));
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<Map<String, Object>>> signUp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String role = request.getOrDefault("role", "RESTAURANT");

        Map<String, Object> responseData = Map.of(
            "email", email,
            "role", role,
            "status", "PENDING_VERIFICATION",
            "message", "Registration submitted. Pending admin verification."
        );

        return ResponseEntity.ok(ApiResponse.success("Registration submitted successfully", responseData));
    }
}
