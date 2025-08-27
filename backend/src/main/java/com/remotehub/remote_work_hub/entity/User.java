package com.remotehub.remote_work_hub.entity;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;
import lombok.*;

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

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "is_active")
    private boolean isActive = true;

    @Column(name = "password_reset_token")
    private String passwordResetToken;

    @Column(name = "token_expiration")
    private java.time.LocalDateTime tokenExpiration;

    @ManyToMany(mappedBy = "members")
    private Set<Team> teams = new HashSet<>();

    @OneToMany(mappedBy = "assignedTo")
    private Set<Task> assignedTasks = new HashSet<>();
}




