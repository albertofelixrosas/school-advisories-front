import axios from 'axios';
import type { User, LoginDto } from '../types/backend.types';
import { UserRole } from '../types/backend.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Interfaces para el servicio de auth
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

class AuthService {
  private tokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';
  private userKey = 'user_data';

  async login(credentials: LoginDto): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(
        `${API_URL}/auth/login`,
        credentials
      );
      
      if (response.data.accessToken) {
        this.setTokens(response.data.accessToken, response.data.refreshToken);
        this.setUser(response.data.user);
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post<AuthResponse>(
        `${API_URL}/auth/refresh`,
        { refreshToken }
      );

      if (response.data.accessToken) {
        this.setTokens(response.data.accessToken, response.data.refreshToken);
        this.setUser(response.data.user);
      }

      return response.data;
    } catch (error) {
      // Si falla el refresh, limpiar tokens
      this.logout();
      throw error;
    }
  }

  async getProfile(): Promise<User> {
    try {
      const response = await axios.get<User>(`${API_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${this.getAccessToken()}`,
        },
      });
      
      this.setUser(response.data);
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userKey);
  }

  // Token management
  getAccessToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.tokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
  }

  // User data management
  getUser(): User | null {
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  private setUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  // Auth status
  isAuthenticated(): boolean {
    return !!this.getAccessToken() && !!this.getUser();
  }

  // Validar si el token está expirado
  isTokenValid(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  }

  // Obtener token almacenado (alias para compatibilidad)
  getStoredToken(): string | null {
    return this.getAccessToken();
  }

  // Obtener refresh token almacenado (alias para compatibilidad)
  getStoredRefreshToken(): string | null {
    return this.getRefreshToken();
  }

  // Role checking utilities
  hasRole(role: UserRole): boolean {
    const user = this.getUser();
    return user?.role === role;
  }

  isStudent(): boolean {
    return this.hasRole(UserRole.STUDENT);
  }

  isProfessor(): boolean {
    return this.hasRole(UserRole.PROFESSOR);
  }

  isAdmin(): boolean {
    const user = this.getUser();
    if (!user) return false;
    return user.role === 'admin' as UserRole;
  }

  // Permission checking (puede expandirse según necesidades)
  hasPermission(permission: string): boolean {
    const user = this.getUser();
    if (!user) return false;

    // Admin tiene todos los permisos
    if (user.role === 'admin' as UserRole) return true;

    // Lógica específica de permisos por rol
    switch (permission) {
      case 'manage_requests':
        return user.role === UserRole.PROFESSOR;
      case 'create_sessions':
        return user.role === UserRole.PROFESSOR;
      case 'manage_users':
        return user.role === 'admin' as UserRole;
      case 'request_advisory':
        return user.role === UserRole.STUDENT;
      default:
        return false;
    }
  }
}

export const authService = new AuthService();