
import { LoginRequest, RegisterRequest, AuthResponse, User, ForgotPasswordRequest, ResetPasswordRequest } from "../types";
import { authAPI } from "./api";

class AuthService {
  private tokenKey = 'token';
  private userKey = 'user';

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await authAPI.login(credentials);
      
      const data = response.data as AuthResponse; 
      
      const { token, ...userData } = data;
      
      if (token) {
        this.setToken(token);
      }
      this.setUser(userData as User);
      return data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }
  
  async register(userData: RegisterRequest): Promise<string> {
    try {
      const response = await authAPI.register(userData);
      return (response.data as { message?: string }).message || 'Registration successful!';
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<string> {
    try {
      const response = await authAPI.forgotPassword(data);
      return (response.data as { message?: string }).message || 'Password reset link sent to email!';
    } catch (error) {
      console.error("Forgot password request failed:", error);
      throw error;
    }
  }

  async resetPassword(data: ResetPasswordRequest): Promise<string> {
    try {
      const response = await authAPI.resetPassword(data);
      const responseData = response.data;

      // The 'response.data' is of type 'unknown' and the `@ts-expect-error` directive is unused.
      // We can remove the redundant `@ts-expect-error` comment and safely narrow the type.
      // We perform runtime checks to safely access the 'message' property.
      if (
        typeof responseData === "object" &&
        responseData !== null &&
        "message" in responseData &&
        typeof responseData.message === "string"
      ) {
        return responseData.message || 'Password has been reset successfully!';
      }
      return 'Password has been reset successfully!';
    } catch (error) {
      console.error("Password reset failed:", error);
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): User | null {
    const userStr = localStorage.getItem(this.userKey);
    if (userStr) {
      try {
        return JSON.parse(userStr) as User;
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
        return null;
      }
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private setUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }
}

export const authService = new AuthService();