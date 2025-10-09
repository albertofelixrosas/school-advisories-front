import type { User } from './user.types';

// DTOs que coinciden con el backend
export interface LoginDto {
  username: string;
  password: string;
}

export interface RefreshTokenDto {
  username: string;
  refresh_token: string;
}

export interface TokenResponseDto {
  access_token: string;
  refresh_token: string;
}

// Respuesta completa del login (lo que devuelve tu backend)
export interface LoginResponse extends TokenResponseDto {
  username: string;
  user?: User; // Si tu backend devuelve info del usuario
}

// Estado de autenticación en el frontend
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  refreshToken: string | null;
}

// Errores de autenticación
export interface AuthError {
  message: string;
  status?: number;
  statusCode?: number;
}