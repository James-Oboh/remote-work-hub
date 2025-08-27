package com.remotehub.remote_work_hub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.remotehub.remote_work_hub.dto.AuthResponse;
import com.remotehub.remote_work_hub.dto.LoginRequest;
import com.remotehub.remote_work_hub.dto.RegisterRequest;
import com.remotehub.remote_work_hub.entity.User;
import com.remotehub.remote_work_hub.entity.Role;
import com.remotehub.remote_work_hub.exception.InvalidCredentialsException;
import com.remotehub.remote_work_hub.repository.UserRepository;
import com.remotehub.remote_work_hub.security.JwtUtil;

import java.util.UUID;
import java.time.LocalDateTime;

@Service
public class AuthService {

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Autowired
  private JwtUtil jwtUtil;

  public AuthResponse register(RegisterRequest request) {
    if (userRepository.existsByUsername(request.getUsername())) {
      throw new InvalidCredentialsException("Username already exists");
    }

    if (userRepository.existsByEmail(request.getEmail())) {
      throw new InvalidCredentialsException("Email already exists");
    }

    User user = User.builder()
        .username(request.getUsername())
        .email(request.getEmail())
        .password(passwordEncoder.encode(request.getPassword()))
        .firstName(request.getFirstName())
        .lastName(request.getLastName())
        .role(Role.USER)
        .isActive(true)
        .build();

    userRepository.save(user);

    String token = jwtUtil.generateToken(
        org.springframework.security.core.userdetails.User.builder()
            .username(user.getUsername())
            .password(user.getPassword())
            .authorities("ROLE_" + user.getRole().name())
            .build()
    );

    return new AuthResponse(
        token,
        user.getUsername(),
        user.getEmail(),
        user.getRole().name(),
        "Registration successful"
    );
  }

  public AuthResponse login(LoginRequest request) {
    User user = userRepository.findByUsername(request.getUsername())
        .orElseThrow(() -> new InvalidCredentialsException("User not found"));

    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
      throw new InvalidCredentialsException("Invalid credentials");
    }

    if (!user.isActive()) {
      throw new InvalidCredentialsException("Account is deactivated");
    }

    String token = jwtUtil.generateToken(
        org.springframework.security.core.userdetails.User.builder()
            .username(user.getUsername())
            .password(user.getPassword())
            .authorities("ROLE_" + user.getRole().name())
            .build()
    );

    return new AuthResponse(
        token,
        user.getUsername(),
        user.getEmail(),
        user.getRole().name(),
        "Login successful"
    );
  }
  
  /**
  * Initiates a password reset by generating a token and setting an expiration time.
  * Note: A real implementation would also send an email with a password reset link.
  */
  public void initiatePasswordReset(String email) {
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new InvalidCredentialsException("Email not found."));
    
    String resetToken = UUID.randomUUID().toString();
    user.setPasswordResetToken(resetToken);
    user.setTokenExpiration(LocalDateTime.now().plusHours(1)); // Token expires in 1 hour
    userRepository.save(user);

    // A real email service would be autowired and used here
    // String resetLink = "http://your-frontend-url/reset-password?token=" + resetToken;
    // emailService.sendPasswordResetEmail(user.getEmail(), resetLink);
  }

  /**
  * Resets the user's password using a valid token.
  */
  public void resetPassword(String token, String newPassword) {
    User user = userRepository.findByPasswordResetToken(token)
        .orElseThrow(() -> new InvalidCredentialsException("Invalid or expired token."));

    if (user.getTokenExpiration().isBefore(LocalDateTime.now())) {
      throw new InvalidCredentialsException("Token has expired.");
    }

    user.setPassword(passwordEncoder.encode(newPassword));
    user.setPasswordResetToken(null);
    user.setTokenExpiration(null);
    userRepository.save(user);
  }
}