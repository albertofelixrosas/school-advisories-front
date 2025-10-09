import { apiClient } from './api.client';
import type { 
  LoginDto, 
  LoginResponse, 
  RefreshTokenDto,
  TokenResponseDto 
} from '../types/auth.types';

export class AuthService {
  async login(credentials: LoginDto): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      '/auth/login',
      credentials
    );
    
    // Guardar tokens en localStorage
    if (response.access_token) {
      localStorage.setItem('access_token', response.access_token);
    }
    if (response.refresh_token) {
      localStorage.setItem('refresh_token', response.refresh_token);
    }
    
    return response;
  }

  async refreshToken(refreshData: RefreshTokenDto): Promise<TokenResponseDto> {
    const response = await apiClient.post<TokenResponseDto>(
      '/auth/refresh',
      refreshData
    );
    
    // Actualizar token de acceso
    if (response.access_token) {
      localStorage.setItem('access_token', response.access_token);
    }
    
    return response;
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      // Limpiar tokens independientemente del resultado
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  getStoredToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getStoredRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  isTokenValid(): boolean {
    const token = this.getStoredToken();
    if (!token) return false;

    try {
      // Decodificar JWT para verificar expiración
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  }
}

export const authService = new AuthService();