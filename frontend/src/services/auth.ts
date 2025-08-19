
import { authAPI } from './api';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../types';

class AuthService {
  private tokenKey = 'token';
  private userKey = 'user';

  // Login method that calls the API and handles token/user storage
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await authAPI.login(credentials);
    const { token, ...userData } = response;
    this.setToken(token);
    this.setUser(userData);
    return response;
  }

  // Register method that calls the API and returns the success message
  async register(userData: RegisterRequest): Promise<string> {
    const response = await authAPI.register(userData);
    return response.message || 'Registration successful!';
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    window.location.href = '/login';
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): User | null {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  private setUser(user: any) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  updateUser(userData: Partial<User>) {
    const current = this.getUser();
    if (current) {
      const updated = { ...current, ...userData };
      this.setUser(updated);
    }
  }
}

const authService = new AuthService();
export default authService;
