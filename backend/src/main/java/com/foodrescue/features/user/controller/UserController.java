package com.foodrescue.features.user.controller;

import com.foodrescue.common.dto.ApiResponse;
import com.foodrescue.features.user.dto.UserResponseDto;
import com.foodrescue.features.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        return ResponseEntity.ok(Map.of("status", "UP", "message", "FoodRescue Backend is running smoothly"));
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<ApiResponse<UserResponseDto>> toggleUserStatus(@PathVariable Long id) {
        UserResponseDto updatedUser = userService.toggleUserStatus(id);
        return ResponseEntity.ok(ApiResponse.success("User account status updated", updatedUser));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User account permanently deleted from database", "SUCCESS"));
    }
}
