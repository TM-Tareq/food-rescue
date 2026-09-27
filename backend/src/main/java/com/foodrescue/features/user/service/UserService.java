package com.foodrescue.features.user.service;

import com.foodrescue.common.exception.ResourceNotFoundException;
import com.foodrescue.features.user.dto.UserResponseDto;
import com.foodrescue.features.user.model.User;
import com.foodrescue.features.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;

    public List<UserResponseDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public UserResponseDto toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        String newStatus = "ACTIVE".equalsIgnoreCase(user.getStatus()) ? "DISABLED" : "ACTIVE";
        user.setStatus(newStatus);
        user.setLastActive("Just now (Status Update)");

        User updated = userRepository.save(user);
        log.info("Updated User ID {} status to {}", userId, newStatus);
        return mapToDto(updated);
    }

    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with ID: " + userId);
        }
        userRepository.deleteById(userId);
        log.info("Permanently deleted User ID {} from database", userId);
    }

    private UserResponseDto mapToDto(User user) {
        return UserResponseDto.builder()
                .id(user.getId())
                .fullName(user.getName())
                .email(user.getEmail())
                .role(user.getRole() != null ? user.getRole().name() : null)
                .status(user.getStatus() != null ? user.getStatus() : "ACTIVE")
                .avatar(user.getAvatar() != null ? user.getAvatar() : "👤")
                .phone(user.getPhone())
                .address(user.getAddress())
                .lastActive(user.getLastActive() != null ? user.getLastActive() : "Recently")
                .createdAt(user.getCreatedAt())
                .build();
    }
}
