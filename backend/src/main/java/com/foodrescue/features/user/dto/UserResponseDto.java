package com.foodrescue.features.user.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDto {
    private Long id;
    private String fullName;
    private String email;
    private String role;
    private String phone;
    private String address;
    private LocalDateTime createdAt;
}
