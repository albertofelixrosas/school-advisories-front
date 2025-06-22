import api from '../api/axios';
import type { LoginRequest, LoginResponse } from '../types/auth';

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', data);
  return response.data;
};

export const refreshAccessToken = async (refresh_token: string): Promise<string> => {
  const response = await api.post<{ access_token: string }>('/auth/refresh', { refresh_token });
  return response.data.access_token;
};
