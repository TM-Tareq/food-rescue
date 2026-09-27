package com.foodrescue.features.user.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "password", nullable = true, length = 255)
    private String password;

    @Column(name = "password_hash", nullable = true, length = 255)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 50)
    private Role role;

    @Builder.Default
    @Column(nullable = false, length = 50)
    private String status = "ACTIVE"; // "ACTIVE", "DISABLED"

    private String avatar;
    private String phone;

    @Column(length = 255)
    private String address;

    private String lastActive;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    @PreUpdate
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "ACTIVE";
        }
        if (this.lastActive == null) {
            this.lastActive = "Recently";
        }
        if (this.passwordHash == null && this.password != null) {
            this.passwordHash = this.password;
        } else if (this.password == null && this.passwordHash != null) {
            this.password = this.passwordHash;
        } else if (this.password == null && this.passwordHash == null) {
            this.password = "123456";
            this.passwordHash = "123456";
        }
    }
}
