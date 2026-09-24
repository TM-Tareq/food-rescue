package com.foodrescue.features.user.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateProfileRequestDto {
    private String fullName;
    private String phone;
    private String address;
    private String avatarEmoji;
}
