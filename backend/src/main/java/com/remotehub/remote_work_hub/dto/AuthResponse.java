package com.remotehub.remote_work_hub.dto;

public class AuthResponse {

    private String token;
    private String username;
    private String email;
    private String role;
    private String message;

    // ✅ Only one no-args constructor
    public AuthResponse() {}

    // ✅ Constructor for token + username only
    public AuthResponse(String token, String username) {
        this.token = token;
        this.username = username;
    }

    // ✅ Full constructor with all fields
    public AuthResponse(String token, String username, String email, String role, String message) {
        this.token = token;
        this.username = username;
        this.email = email;
        this.role = role;
        this.message = message;
    }

    // Getters
    public String getToken() { return token; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public String getMessage() { return message; }

    // Setters
    public void setToken(String token) { this.token = token; }
    public void setUsername(String username) { this.username = username; }
    public void setEmail(String email) { this.email = email; }
    public void setRole(String role) { this.role = role; }
    public void setMessage(String message) { this.message = message; }

    // Optional: toString
    @Override
    public String toString() {
        return "AuthResponse{" +
                "token='" + token + '\'' +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", role='" + role + '\'' +
                ", message='" + message + '\'' +
                '}';
    }
}
